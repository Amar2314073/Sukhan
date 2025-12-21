const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redisClient = require('../config/redis');
const ms = require('ms');
const User = require('../models/user');
const userValidator = require('../utils/userValidator');

const tokenValidity = '100d';


// Register
exports.register = async (req,res) => {
    try{

        userValidator(req.body);

        // Check if user already exists
        
        const {name, email, password} = req.body;
        req.body.role = 'user';
        req.body.password = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email" });
        }

        // creating user and sending token after register
        const user = await User.create(req.body);
        const token = jwt.sign({ _id: user._id, email: email, role: 'user' }, process.env.JWT_KEY, { expiresIn: tokenValidity })
        res.cookie("token", token, {
            httpOnly: true,           
            secure: process.env.NODE_ENV === "production",             
            sameSite: "none",
            maxAge: ms(tokenValidity)
        });

        const response = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        res.status(200).json({
            user: response,
            message: "Registered Successfully!"
        });

    } catch(error){
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Login
exports.login = async (req,res) => {

    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const verified = await bcrypt.compare(password, user.password);
        if (!verified) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ _id: user._id, email: email, role: user.role }, process.env.JWT_KEY, { expiresIn: tokenValidity })
        res.cookie("token", token, {
            httpOnly: true,           
            secure: process.env.NODE_ENV === "production",             
            sameSite: "none",
            maxAge: ms(tokenValidity)
        });

        const response = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        res.status(200).json({
            user: response,
            message: "Logged in Successfully!"
        });
    } catch(error){
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

// Logout
exports.logout = async (req,res) => {
    try{
        const { token } = req.cookies;
        const payload = jwt.decode(token);
        if(!token){
            return res.status(200).json({ message: "Already logged out" });
        }

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none"
        });

         res.status(200).json({ message: "Logged out successfully!" });

    } catch(error){
        console.error("Logout error:", error);
        res.clearCookie("token");
        res.status(500).json({ message: "Error during logout" });
    }
}

// Admin Register
exports.adminRegister = async (req,res) => {
    try{

        userValidator(req.body)
        const {name, email, password} = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email" });
        }
        
        req.body.role = 'admin';
        req.body.password = await bcrypt.hash(password, 10);


        const newUser = await User.create(req.body);
        const token = jwt.sign({ _id: newUser._id, email: email, role: 'admin' }, process.env.JWT_KEY, { expiresIn: tokenValidity })
        res.cookie("token", token, {
            httpOnly: true,           
            secure: process.env.NODE_ENV === "production",             
            sameSite: "none",
            maxAge: ms(tokenValidity)
        });

        const response = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }

        res.status(200).json({
            newUser: response,
            message: "Registered Successfully!"
        });

    } catch(error){
        console.error("Admin registration error:", error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({ message: "Email already exists" });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Internal server error" });
    }
}

// Check
exports.check = async(req,res)=>{
    try{
        const reply = {
        name:req.user.name,
        email:req.user.email,
        _id:req.user._id,
        role:req.user.role,
        profileImage: req.user.avatar
    }
    res.status(200).json({
        user:reply,
        message:"Valid User!"
    })
    }catch(error){
        console.error("Check error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// getProfile
exports.getProfile = async (req, res) => {
    try {
        // User is already attached by userMiddleware
        const user = req.user;

        // Use getPublicProfile method if available, otherwise exclude password manually
        const userProfile = user.getPublicProfile ? user.getPublicProfile() : {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            location: user.location,
            preferredLanguage: user.preferredLanguage,
            notificationSettings: user.notificationSettings,
            role: user.role,
            isVerified: user.isVerified,
            stats: user.stats
        };

        res.status(200).json({
            user: userProfile,
            message: "Profile fetched successfully"
        });

    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
};

// updateProfile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        // Fields that cannot be updated through this route
        const restrictedFields = ['_id', 'password', 'role', 'isVerified', 'createdAt', 'updatedAt'];
        
        // Remove restricted fields from updates
        restrictedFields.forEach(field => delete updates[field]);

        // If email is being updated, check if it's already taken by another user
        if (updates.email && updates.email !== req.user.email) {
            const existingUser = await User.findOne({ email: updates.email });
            if (existingUser) {
                return res.status(409).json({ message: "Email already taken" });
            }
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: updatedUser.getPublicProfile ? updatedUser.getPublicProfile() : updatedUser,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Update profile error:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error updating profile" });
    }
};

// deleteProfile
exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { password } = req.body;

        // Require password confirmation for security
        if (!password) {
            return res.status(400).json({ message: "Password is required to delete account" });
        }

        // Verify password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // TODO: Later add cleanup for related data (favorites, userCollections, etc.)
        // await Favorite.deleteMany({ user: userId });
        // await UserCollection.deleteMany({ user: userId });

        // Delete user
        await User.findByIdAndDelete(userId);

        // Clear cookie and blacklist token
        const token = req.cookies.token;
        if (token) {
            const payload = jwt.verify(token, process.env.JWT_KEY);
            const ttl = payload.exp - Math.floor(Date.now() / 1000);
            
            if (ttl > 0) {
                 await redisClient.set(`token:${token}`, 'Blocked');
                await redisClient.expireAt(`token:${token}`, payload.exp);
            }
            
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });
        }

        res.status(200).json({ message: "Account deleted successfully" });

    } catch (error) {
        console.error("Delete profile error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            // Still delete the user even if token is invalid
            await User.findByIdAndDelete(req.user._id);
            res.clearCookie("token");
            return res.status(200).json({ message: "Account deleted successfully" });
        }
        
        res.status(500).json({ message: "Error deleting account" });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" });
        }

        // Check if new password meets minimum requirements
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Error changing password" });
    }
};

// Toggle Like Poem
exports.toggleLike = async (req, res) => {
    try {
        const userId = req.user._id;
        const { poemId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const index = user.likedPoems.findIndex(
            id => id.toString() === poemId
        );

        let liked;

        if (index === -1) {
            // like
            user.likedPoems.push(poemId);
            liked = true;
        } else {
            // unlike
            user.likedPoems.splice(index, 1);
            liked = false;
        }

        await user.save();

        res.status(200).json({
            liked,
            totalLikes: user.likedPoems.length,
            message: liked ? "Poem liked" : "Poem unliked"
        });

    } catch (error) {
        console.error("Toggle like error:", error);
        res.status(500).json({ message: "Error toggling like" });
    }
};

// Toggle Save Poem
exports.toggleSave = async (req, res) => {
    try {
        const userId = req.user._id;
        const { poemId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const index = user.savedPoems.findIndex(
            id => id.toString() === poemId
        );

        let saved;

        if (index === -1) {
            // save
            user.savedPoems.push(poemId);
            saved = true;
        } else {
            // unsave
            user.savedPoems.splice(index, 1);
            saved = false;
        }

        await user.save();

        res.status(200).json({
            saved,
            totalSaved: user.savedPoems.length,
            message: saved ? "Poem saved" : "Poem removed from saved"
        });

    } catch (error) {
        console.error("Toggle save error:", error);
        res.status(500).json({ message: "Error toggling save" });
    }
};




