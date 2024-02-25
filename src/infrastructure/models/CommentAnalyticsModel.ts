import mongoose, { Schema, InferSchemaType } from 'mongoose';

const CommentAnalyticsSchema = new Schema({
  commentAnalyticsId: {
    type: String,
    required: true,
  },
  commentId: {
    type: String,
    required: true,
  },
  comment: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Comment',
  },
  likeCount: {
    type: Number,
    required: true,
  },
  replyCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

export type CommentAnalytics = InferSchemaType<typeof CommentAnalyticsSchema>;

export const CommentAnalyticsModel = mongoose.model(
  'CommentAnalytics',
  CommentAnalyticsSchema,
);
