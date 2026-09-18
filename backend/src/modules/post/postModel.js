const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must have an author'],
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Post content cannot be empty'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    media: [
      {
        url: { type: String, required: true },
        mediaType: { type: String, enum: ['image', 'video', 'document'], default: 'image' },
        publicId: { type: String },
      },
    ],
    category: {
      type: String,
      required: [true, 'Please select a category for this post'],
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    postType: {
      type: String,
      enum: ['standard', 'job', 'news'],
      default: 'standard',
      index: true,
    },
    // Specialized payload for Job posts
    jobDetails: {
      companyName: { type: String, trim: true },
      location: { type: String, trim: true },
      jobType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'], default: 'Full-Time' },
      experienceLevel: { type: String, default: 'Mid-Level' },
      salaryRange: { type: String, default: 'Competitive' },
      skills: [{ type: String, trim: true }],
      applyUrl: { type: String, trim: true },
      deadline: { type: Date },
    },
    // Specialized payload for News posts
    newsDetails: {
      headline: { type: String, trim: true },
      summary: { type: String, trim: true },
      source: { type: String, trim: true },
      sourceUrl: { type: String, trim: true },
      isVerifiedSource: { type: Boolean, default: false },
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    savesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for feed queries, tags, and category exploration
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ postType: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
