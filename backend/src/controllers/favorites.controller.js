const Favorite = require('../models/favorite');
const Poem = require('../models/poem');
const User = require('../models/user');

// POST /favorites/:poemId - add poem to favorites
exports.addToFavorites = async (req, res) => {
    try {
        const userId = req.user._id;
        const poemId = req.params.poemId;

        // Check if poem exists and is active
        const poem = await Poem.findById(poemId);
        if (!poem || !poem.isActive) {
            return res.status(404).json({ message: "Poem not found" });
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({
            user: userId,
            poem: poemId
        });

        if (existingFavorite) {
            return res.status(409).json({ message: "Poem already in favorites" });
        }

        // Get poem type from category
        const poemType = poem.category?.type || 'other';

        // Create favorite
        const favorite = await Favorite.create({
            user: userId,
            poem: poemId,
            poemType: poemType
        });

        // Populate the favorite with poem details
        const populatedFavorite = await Favorite.findById(favorite._id)
            .populate({
                path: 'poem',
                select: 'title content poet category views popularity',
                populate: [
                    { path: 'poet', select: 'name era' },
                    { path: 'category', select: 'name type' }
                ]
            });

        // Update user's favorites count
        await User.findByIdAndUpdate(userId, {
            $inc: { 'stats.favoritesCount': 1 }
        });

        res.status(201).json({
            favorite: populatedFavorite,
            message: "Poem added to favorites successfully"
        });

    } catch (error) {
        console.error("Add to favorites error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid poem ID" });
        }
        
        res.status(500).json({ message: "Error adding to favorites" });
    }
}

// DELETE /favorites/:poemId - remove poem from favorites
exports.removeFromFavorites = async (req, res) => {
    try {
        const userId = req.user._id;
        const poemId = req.params.poemId;

        // Find and delete the favorite
        const favorite = await Favorite.findOneAndDelete({
            user: userId,
            poem: poemId
        });

        if (!favorite) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        // Update user's favorites count
        await User.findByIdAndUpdate(userId, {
            $inc: { 'stats.favoritesCount': -1 }
        });

        res.status(200).json({
            message: "Poem removed from favorites successfully"
        });

    } catch (error) {
        console.error("Remove from favorites error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid poem ID" });
        }
        
        res.status(500).json({ message: "Error removing from favorites" });
    }
}

// GET /favorites - get user's favorites with pagination
exports.getUserFavorites = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter by poem type if provided
        const filter = { user: userId };
        if (req.query.type && ['sher', 'ghazal', 'nazm'].includes(req.query.type)) {
            filter.poemType = req.query.type;
        }

        // Get favorites with poem details
        const favorites = await Favorite.find(filter)
            .populate({
                path: 'poem',
                select: 'title content poet category views popularity createdAt',
                populate: [
                    { path: 'poet', select: 'name era' },
                    { path: 'category', select: 'name type' }
                ]
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Remove favorites where poem might have been deleted
        const validFavorites = favorites.filter(fav => fav.poem !== null);

        // Get total count
        const total = await Favorite.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        // Format response
        const favoritesData = validFavorites.map(fav => ({
            _id: fav._id,
            poem: fav.poem,
            poemType: fav.poemType,
            favoritedAt: fav.createdAt
        }));

        res.status(200).json({
            favorites: favoritesData,
            pagination: {
                currentPage: page,
                totalPages,
                totalFavorites: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: "Favorites fetched successfully"
        });

    } catch (error) {
        console.error("Get user favorites error:", error);
        res.status(500).json({ message: "Error fetching favorites" });
    }
}

// GET /favorites/check/:poemId - check if poem is favorited
exports.checkIfFavorited = async (req, res) => {
    try {
        const userId = req.user._id;
        const poemId = req.params.poemId;

        const favorite = await Favorite.findOne({
            user: userId,
            poem: poemId
        });

        res.status(200).json({
            isFavorited: !!favorite,
            favoriteId: favorite?._id || null,
            message: "Check completed successfully"
        });

    } catch (error) {
        console.error("Check favorite error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid poem ID" });
        }
        
        res.status(500).json({ message: "Error checking favorite status" });
    }
}

// GET /favorites/stats - get user's favorites statistics
exports.getFavoritesStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get counts by type
        const stats = await Favorite.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: '$poemType',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format stats
        const formattedStats = {
            total: 0,
            sher: 0,
            ghazal: 0,
            nazm: 0
        };

        stats.forEach(stat => {
            formattedStats[stat._id] = stat.count;
            formattedStats.total += stat.count;
        });

        // Get recent favorites
        const recentFavorites = await Favorite.find({ user: userId })
            .populate({
                path: 'poem',
                select: 'title poet',
                populate: { path: 'poet', select: 'name' }
            })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            stats: formattedStats,
            recentFavorites: recentFavorites.map(fav => ({
                _id: fav._id,
                poem: fav.poem,
                poemType: fav.poemType,
                favoritedAt: fav.createdAt
            })),
            message: "Favorites statistics fetched successfully"
        });

    } catch (error) {
        console.error("Get favorites stats error:", error);
        res.status(500).json({ message: "Error fetching favorites statistics" });
    }
}

// GET /favorites/by-type/:type - get favorites by specific type
exports.getFavoritesByType = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Validate type
        const validTypes = ['sher', 'ghazal', 'nazm'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ 
                message: "Invalid type. Must be: sher, ghazal, or nazm" 
            });
        }

        const favorites = await Favorite.find({
            user: userId,
            poemType: type
        })
        .populate({
            path: 'poem',
            select: 'title content poet category views popularity',
            populate: [
                { path: 'poet', select: 'name era' },
                { path: 'category', select: 'name type' }
            ]
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        // Remove favorites where poem might have been deleted
        const validFavorites = favorites.filter(fav => fav.poem !== null);

        const total = await Favorite.countDocuments({
            user: userId,
            poemType: type
        });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            type,
            favorites: validFavorites.map(fav => ({
                _id: fav._id,
                poem: fav.poem,
                favoritedAt: fav.createdAt
            })),
            pagination: {
                currentPage: page,
                totalPages,
                totalFavorites: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} favorites fetched successfully`
        });

    } catch (error) {
        console.error("Get favorites by type error:", error);
        res.status(500).json({ message: "Error fetching favorites by type" });
    }
}

// DELETE /favorites - clear all favorites (optional)
exports.clearAllFavorites = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get count before deletion
        const favoritesCount = await Favorite.countDocuments({ user: userId });

        // Delete all favorites
        await Favorite.deleteMany({ user: userId });

        // Reset user's favorites count
        await User.findByIdAndUpdate(userId, {
            $set: { 'stats.favoritesCount': 0 }
        });

        res.status(200).json({
            message: `Cleared ${favoritesCount} favorites successfully`
        });

    } catch (error) {
        console.error("Clear all favorites error:", error);
        res.status(500).json({ message: "Error clearing favorites" });
    }
}