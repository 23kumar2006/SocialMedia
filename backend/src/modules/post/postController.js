const Post = require('./postModel');
const Category = require('../category/categoryModel');
const User = require('../user/userModel');
const Follow = require('../follow/followModel');
const Like = require('../interaction/likeModel');
const ApiResponse = require('../../utils/apiResponse');

/**
 * @desc   Get post feeds (For You, Category, Trending, Following, Profile)
 * @route  GET /api/posts
 * @access Public (Personalized with optional token)
 */
exports.getPosts = async (req, res, next) => {
  try {
    const {
      category,
      feedType = 'for-you',
      tag,
      search,
      author,
      postType,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isFlagged: false };
    const parsedLimit = Math.min(parseInt(limit, 10) || 20, 50);
    const skip = (parseInt(page, 10) - 1) * parsedLimit;

    // Filter by specific Category slug
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    // Filter by author username or ID
    if (author) {
      if (author.match(/^[0-9a-fA-F]{24}$/)) {
        query.author = author;
      } else {
        const userDoc = await User.findOne({ username: author.toLowerCase() });
        if (userDoc) query.author = userDoc._id;
      }
    }

    // Filter by Hashtag
    if (tag) {
      const normalizedTag = tag.startsWith('#') ? tag.toLowerCase() : `#${tag.toLowerCase()}`;
      query.tags = normalizedTag;
    }

    // Filter by specialized Post Type (standard, job, news)
    if (postType) {
      query.postType = postType;
    }

    // Text search in title or content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { 'jobDetails.companyName': { $regex: search, $options: 'i' } },
        { 'newsDetails.headline': { $regex: search, $options: 'i' } },
      ];
    }

    // Following Feed logic
    if (feedType === 'following' && req.user) {
      const follows = await Follow.find({
        follower: req.user._id,
        targetType: 'user',
      }).select('followingUser');

      const followedUserIds = follows.map((f) => f.followingUser);
      query.author = { $in: followedUserIds };
    }

    // Sorting strategy
    let sort = { createdAt: -1 };
    if (feedType === 'trending') {
      sort = { likesCount: -1, commentsCount: -1, createdAt: -1 };
    }

    // Execute query with population
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name username role avatar isVerified')
        .sort(sort)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Post.countDocuments(query),
    ]);

    // Attach user-specific interaction states if logged in
    let enrichedPosts = posts;
    if (req.user) {
      const userId = req.user._id;
      const postIds = posts.map((p) => p._id);

      const userLikes = await Like.find({
        user: userId,
        targetType: 'post',
        targetId: { $in: postIds },
      }).select('targetId');

      const likedPostIds = new Set(userLikes.map((l) => l.targetId.toString()));
      const savedPostIds = new Set((req.user.savedPosts || []).map((id) => id.toString()));

      enrichedPosts = posts.map((p) => ({
        ...p,
        isLiked: likedPostIds.has(p._id.toString()),
        isSaved: savedPostIds.has(p._id.toString()),
      }));
    }

    return ApiResponse.success(
      res,
      {
        posts: enrichedPosts,
        pagination: {
          total,
          page: parseInt(page, 10),
          pages: Math.ceil(total / parsedLimit),
          limit: parsedLimit,
        },
      },
      'Posts retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a new Post (Standard, Job, or News)
 * @route  POST /api/posts
 * @access Private
 */
exports.createPost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      media,
      category,
      subcategory,
      tags,
      postType = 'standard',
      jobDetails,
      newsDetails,
    } = req.body;

    if (!content || !content.trim()) {
      return ApiResponse.badRequest(res, 'Post content is required');
    }

    if (!category) {
      return ApiResponse.badRequest(res, 'Please select a valid category');
    }

    // Extract hashtags automatically from content if not explicitly provided
    let extractedTags = Array.isArray(tags) ? tags : [];
    const hashRegex = /#([a-zA-Z0-9_]+)/g;
    let match;
    while ((match = hashRegex.exec(content)) !== null) {
      const tagStr = `#${match[1].toLowerCase()}`;
      if (!extractedTags.includes(tagStr)) {
        extractedTags.push(tagStr);
      }
    }

    // Role verification for specialized formats:
    // Organizations and Admins have priority for verified Jobs and News posts
    const postData = {
      author: req.user._id,
      title: title ? title.trim() : '',
      content: content.trim(),
      media: Array.isArray(media) ? media : [],
      category: category.toLowerCase().trim(),
      subcategory: subcategory ? subcategory.trim() : '',
      tags: extractedTags,
      postType: ['standard', 'job', 'news'].includes(postType) ? postType : 'standard',
    };

    // Attach Job Details if applicable
    if (postType === 'job' && jobDetails) {
      postData.jobDetails = {
        companyName: jobDetails.companyName || req.user.name,
        location: jobDetails.location || 'Remote',
        jobType: jobDetails.jobType || 'Full-Time',
        experienceLevel: jobDetails.experienceLevel || 'Mid-Level',
        salaryRange: jobDetails.salaryRange || 'Competitive',
        skills: Array.isArray(jobDetails.skills) ? jobDetails.skills : [],
        applyUrl: jobDetails.applyUrl || '',
        deadline: jobDetails.deadline || null,
      };
    }

    // Attach News Details if applicable
    if (postType === 'news' && newsDetails) {
      postData.newsDetails = {
        headline: newsDetails.headline || title || content.slice(0, 100),
        summary: newsDetails.summary || content.slice(0, 250),
        source: newsDetails.source || req.user.name,
        sourceUrl: newsDetails.sourceUrl || '',
        isVerifiedSource: req.user.isVerified || req.user.role === 'organization',
      };
    }

    const post = await Post.create(postData);
    await post.populate('author', 'name username role avatar isVerified');

    // Increment user post counter and category post counter
    await Promise.all([
      User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } }),
      Category.findOneAndUpdate({ slug: category.toLowerCase() }, { $inc: { postsCount: 1 } }),
    ]);

    // Emit live post via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('post:created', post);
      io.emit(`category:${post.category}:post`, post);
    }

    return ApiResponse.created(res, { post }, 'Post published successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single post by ID
 * @route  GET /api/posts/:id
 * @access Public
 */
exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', 'name username role avatar isVerified');

    if (!post) {
      return ApiResponse.notFound(res, 'Post not found');
    }

    let isLiked = false;
    let isSaved = false;

    if (req.user) {
      const like = await Like.findOne({
        user: req.user._id,
        targetType: 'post',
        targetId: post._id,
      });
      isLiked = !!like;
      isSaved = (req.user.savedPosts || []).some((savedId) => savedId.toString() === post._id.toString());
    }

    return ApiResponse.success(res, { post: { ...post.toObject(), isLiked, isSaved } }, 'Post retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete post
 * @route  DELETE /api/posts/:id
 * @access Private (Author, Moderator, or Admin)
 */
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return ApiResponse.notFound(res, 'Post not found');
    }

    const isAuthor = post.author.toString() === req.user._id.toString();
    const isElevated = req.user.role === 'admin' || req.user.role === 'moderator';

    if (!isAuthor && !isElevated) {
      return ApiResponse.forbidden(res, 'You do not have permission to delete this post');
    }

    await Post.findByIdAndDelete(id);

    // Decrement counters
    await Promise.all([
      User.findByIdAndUpdate(post.author, { $inc: { postsCount: -1 } }),
      Category.findOneAndUpdate({ slug: post.category }, { $inc: { postsCount: -1 } }),
    ]);

    return ApiResponse.success(res, null, 'Post deleted successfully');
  } catch (error) {
    next(error);
  }
};
