import mongoose from 'mongoose';

const ThreadVoteSchema = new mongoose.Schema({
  threadVoteId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  threadId: {
    type: String,
    required: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
    required: true,
  },
  type: {
    type: ['up', 'down'],
    required: true,
  },
});

export const ThreadVoteModel = mongoose.model('ThreadVote', ThreadVoteSchema);

export default ThreadVoteModel;
