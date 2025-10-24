const Category = require('../models/category');
const Poem = require('../models/poem');

// GET /categories - get all categories with pagination
exports.getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { isActive: true };

        // Filter by type if provided
        if (req.query.type && ['sher', 'ghazal', 'nazm', 'kitaa', 'other'].includes(req.query.type)) {
            filter.type = req.query.type;
        }

        // Get categories
        const categories = await Category.find(filter)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)
            .select('-isActive');

        // Get total count for pagination
        const total = await Category.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            categories,
            pagination: {
                currentPage: page,
                totalPages,
                totalCategories: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: "Categories fetched successfully"
        });

    } catch (error) {
        console.error("Get all categories error:", error);
        res.status(500).json({ message: "Error fetching categories" });
    }
}

// GET /categories/:id - get category by id
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (!category.isActive) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Get category statistics
        const poemCount = await Poem.countDocuments({ 
            category: category._id, 
            isActive: true 
        });

        const categoryStats = {
            poemCount
        };

        res.status(200).json({
            category: {
                ...category.toObject(),
                stats: categoryStats
            },
            message: "Category fetched successfully"
        });

    } catch (error) {
        console.error("Get category by ID error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        
        res.status(500).json({ message: "Error fetching category" });
    }
}

// GET /categories/type/:type - get categories by type
exports.getCategoriesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Validate type
        const validTypes = ['sher', 'ghazal', 'nazm', 'other'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ 
                message: "Invalid type. Must be: sher, ghazal, nazm, or other" 
            });
        }

        const categories = await Category.find({ 
            type, 
            isActive: true 
        })
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);

        const total = await Category.countDocuments({ type, isActive: true });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            type,
            categories,
            pagination: {
                currentPage: page,
                totalPages,
                totalCategories: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: "Categories fetched successfully"
        });

    } catch (error) {
        console.error("Get categories by type error:", error);
        res.status(500).json({ message: "Error fetching categories by type" });
    }
}

// GET /categories/:id/poems - get poems by category
exports.getPoemsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category || !category.isActive) {
            return res.status(404).json({ message: "Category not found" });
        }

        const poems = await Poem.find({ category: categoryId, isActive: true })
            .populate('poet', 'name era')
            .sort({ popularity: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Poem.countDocuments({ category: categoryId, isActive: true });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            category: {
                _id: category._id,
                name: category.name,
                type: category.type,
                description: category.description
            },
            poems,
            pagination: {
                currentPage: page,
                totalPages,
                totalPoems: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: "Poems fetched successfully"
        });

    } catch (error) {
        console.error("Get poems by category error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        
        res.status(500).json({ message: "Error fetching poems" });
    }
}

// POST /categories - create category (admin only)
exports.createCategory = async (req, res) => {
    try {
        const { name, description, type } = req.body;

        // Validate required fields
        if (!name || !type) {
            return res.status(400).json({ 
                message: "Name and type are required" 
            });
        }

        // Validate type
        const validTypes = ['sher', 'ghazal', 'nazm', 'other'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ 
                message: "Invalid type. Must be: sher, ghazal, nazm, or other" 
            });
        }

        // Check if category already exists (case insensitive)
        const existingCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });

        if (existingCategory) {
            return res.status(409).json({ 
                message: "Category with this name already exists" 
            });
        }

        // Create category
        const category = await Category.create({
            name: name.trim(),
            description: description?.trim() || '',
            type
        });

        res.status(201).json({
            category,
            message: "Category created successfully"
        });

    } catch (error) {
        console.error("Create category error:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error creating category" });
    }
}

// PUT /categories/:id - update category (admin only)
exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, description, type } = req.body;

        // Find existing category
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Validate type if provided
        if (type) {
            const validTypes = ['sher', 'ghazal', 'nazm', 'other'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ 
                    message: "Invalid type. Must be: sher, ghazal, nazm, or other" 
                });
            }
        }

        // Check for duplicate name if name is being updated
        if (name && name !== existingCategory.name) {
            const duplicateCategory = await Category.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: categoryId }
            });

            if (duplicateCategory) {
                return res.status(409).json({ 
                    message: "Another category with this name already exists" 
                });
            }
        }

        // Prepare update object
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (type) updateData.type = type;

        // Update category
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            category: updatedCategory,
            message: "Category updated successfully"
        });

    } catch (error) {
        console.error("Update category error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error updating category" });
    }
}

// DELETE /categories/:id - delete category (admin only)
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Find category
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check if category has poems
        const poemCount = await Poem.countDocuments({ category: categoryId, isActive: true });
        if (poemCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete category. There are ${poemCount} poems associated with this category.` 
            });
        }

        // Soft delete (set isActive to false)
        category.isActive = false;
        await category.save();

        res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Delete category error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        
        res.status(500).json({ message: "Error deleting category" });
    }
}

// GET /categories/stats/types - get category statistics by type
exports.getCategoryStats = async (req, res) => {
    try {
        // Get counts by type
        const stats = await Category.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get poem counts by category type
        const poemStats = await Poem.aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: '$categoryInfo' },
            {
                $group: {
                    _id: '$categoryInfo.type',
                    poemCount: { $sum: 1 },
                    totalViews: { $sum: '$views' }
                }
            }
        ]);

        // Format stats
        const formattedStats = {
            totalCategories: 0,
            totalPoems: 0,
            types: {
                sher: { categories: 0, poems: 0, views: 0 },
                ghazal: { categories: 0, poems: 0, views: 0 },
                nazm: { categories: 0, poems: 0, views: 0 },
                other: { categories: 0, poems: 0, views: 0 }
            }
        };

        // Fill category counts
        stats.forEach(stat => {
            if (formattedStats.types[stat._id]) {
                formattedStats.types[stat._id].categories = stat.count;
                formattedStats.totalCategories += stat.count;
            }
        });

        // Fill poem counts and views
        poemStats.forEach(stat => {
            if (formattedStats.types[stat._id]) {
                formattedStats.types[stat._id].poems = stat.poemCount;
                formattedStats.types[stat._id].views = stat.totalViews;
                formattedStats.totalPoems += stat.poemCount;
            }
        });

        res.status(200).json({
            stats: formattedStats,
            message: "Category statistics fetched successfully"
        });

    } catch (error) {
        console.error("Get category stats error:", error);
        res.status(500).json({ message: "Error fetching category statistics" });
    }
}

// GET /categories/search?q=... - search categories
exports.searchCategories = async (req, res) => {
    try {
        const query = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        if (!query || query.trim() === '') {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Build search filter
        const searchFilter = {
            isActive: true,
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };

        // Additional type filter
        if (req.query.type) {
            searchFilter.type = req.query.type;
        }

        // Search categories
        const categories = await Category.find(searchFilter)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        // Get total count
        const total = await Category.countDocuments(searchFilter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            categories,
            pagination: {
                currentPage: page,
                totalPages,
                totalResults: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: categories.length > 0 ? "Search completed successfully" : "No categories found"
        });

    } catch (error) {
        console.error("Search categories error:", error);
        res.status(500).json({ message: "Error searching categories" });
    }
}