const Category = require('./categoryModel');
const Follow = require('../follow/followModel');
const ApiResponse = require('../../utils/apiResponse');

/**
 * @desc   Get all active categories
 * @route  GET /api/categories
 * @access Public
 */
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return ApiResponse.success(res, { categories }, 'Categories fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single category by slug
 * @route  GET /api/categories/:slug
 * @access Public
 */
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug: slug.toLowerCase() });

    if (!category) {
      return ApiResponse.notFound(res, `Category not found with slug: ${slug}`);
    }

    return ApiResponse.success(res, { category }, 'Category retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new dynamic category
 * @route  POST /api/categories
 * @access Admin
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, color, subcategories } = req.body;

    if (!name || !description) {
      return ApiResponse.badRequest(res, 'Category name and description are required');
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return ApiResponse.badRequest(res, 'Category with this name or slug already exists');
    }

    const category = await Category.create({
      name,
      slug,
      description,
      icon: icon || 'Tag',
      color: color || 'text-brand-400',
      subcategories: Array.isArray(subcategories) ? subcategories : [],
      isDynamic: true,
    });

    return ApiResponse.created(res, { category }, 'Category created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Follow or unfollow a category
 * @route  POST /api/categories/:slug/follow
 * @access Private
 */
exports.toggleFollowCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.user._id;

    const category = await Category.findOne({ slug: slug.toLowerCase() });
    if (!category) {
      return ApiResponse.notFound(res, 'Category not found');
    }

    const existingFollow = await Follow.findOne({
      follower: userId,
      targetType: 'category',
      followingCategory: category.slug,
    });

    let isFollowing = false;

    if (existingFollow) {
      await Follow.findByIdAndDelete(existingFollow._id);
      await Category.findByIdAndUpdate(category._id, { $inc: { followersCount: -1 } });
      isFollowing = false;
    } else {
      await Follow.create({
        follower: userId,
        targetType: 'category',
        followingCategory: category.slug,
      });
      await Category.findByIdAndUpdate(category._id, { $inc: { followersCount: 1 } });
      isFollowing = true;
    }

    return ApiResponse.success(
      res,
      { isFollowing, categorySlug: category.slug },
      isFollowing ? `Now following ${category.name}` : `Unfollowed ${category.name}`
    );
  } catch (error) {
    next(error);
  }
};
