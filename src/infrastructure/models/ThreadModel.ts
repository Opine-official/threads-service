import mongoose, { Schema, InferSchemaType } from 'mongoose';

const ThreadSchema = new Schema(
  {
    threadId: { type: String, required: true },
    postId: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    commentCount: { type: Number, required: true },
  },
  { timestamps: true },
);

type ThreadModel = InferSchemaType<typeof ThreadSchema>;

const ThreadModel = mongoose.model('Thread', ThreadSchema);

export default ThreadModel;
