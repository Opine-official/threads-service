import { Thread } from '../../domain/entities/Thread';

export interface IThreadRepository {
  save(thread: Thread): Promise<void | Error>;
  //   findThreadByPostId(postId: string): Promise<Thread | null>;
  //   findThreadsByUserId(userId: string): Promise<Thread[] | Error>;
  //   updateCommentCount(threadId: string, commentCount: number): Promise<void | Error>;
}
