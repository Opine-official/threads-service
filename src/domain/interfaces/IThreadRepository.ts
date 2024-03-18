import { Thread } from '../entities/Thread';
import { PopulatedThreadModel } from '../../infrastructure/models/ThreadModel';
import { Types } from 'mongoose';

export type votes = {
  upVotes: number;
  downVotes: number;
};
export interface IThreadRepository {
  save(thread: Thread): Promise<void | Error>;
  findRecommendedThreads(
    userId: string,
    mongoUserId: Types.ObjectId,
  ): Promise<PopulatedThreadModel[] | Error>;
  updateComment(threadId: string, commentId: string): Promise<void | Error>;
  findThreadIdByPostId(postId: string): Promise<string | Error>;
  findMongoIdByThreadId(threadId: string): Promise<string | Error>;
  upVote(threadId: string, user: string): Promise<votes | Error>;
  downVote(threadId: string, user: string): Promise<votes | Error>;
}
