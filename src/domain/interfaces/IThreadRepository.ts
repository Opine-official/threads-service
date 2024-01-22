import { Thread } from '../../domain/entities/Thread';
import { PopulatedThreadModel } from '../../infrastructure/models/ThreadModel';

export interface IThreadRepository {
  save(thread: Thread): Promise<void | Error>;
  findRecommendedThreads(
    userId: string | undefined, // temporarily accepting undefined
  ): Promise<PopulatedThreadModel[] | Error>;
  updateComment(threadId: string, commentId: string): Promise<void | Error>;
  findThreadIdByPostId(postId: string): Promise<string | Error>;
  //   findThreadByPostId(postId: string): Promise<Thread | null>;
  // findThreadsByUserId(userId: string): Promise<Thread[] | Error>;
  //   updateCommentCount(threadId: string, commentCount: number): Promise<void | Error>;
}
