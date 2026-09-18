const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['user', 'category'],
      required: true,
    },
    followingUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    followingCategory: {
      type: String, // Category slug
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

followSchema.index({ follower: 1, targetType: 1, followingUser: 1 });
followSchema.index({ follower: 1, targetType: 1, followingCategory: 1 });

module.exports = mongoose.model('Follow', followSchema);
