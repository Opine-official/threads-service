import mongoose, { Schema, InferSchemaType } from 'mongoose';

const CommentSchema = new Schema(
  {
    commentId: { type: String, required: true },
    postId: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

type CommentModel = InferSchemaType<typeof CommentSchema>;

const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;
