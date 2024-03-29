import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { PostModel } from './PostModel';
import { UserModel } from './UserModel';

const ThreadSchema = new Schema(
  {
    threadId: { type: String, required: true },
    postId: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    commentCount: { type: Number, required: true },
    upVotes: { type: Number, required: true, default: 0 },
    downVotes: { type: Number, required: true, default: 0 },
    upVoters: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downVoters: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

type ThreadModel = InferSchemaType<typeof ThreadSchema>;

export type PopulatedThreadModel = ThreadModel & PostModel & UserModel;
const ThreadModel = mongoose.model('Thread', ThreadSchema);

export default ThreadModel;
