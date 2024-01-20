import { IThreadRepository } from '../../domain/interfaces/IThreadRepository';
import { Thread } from '../../domain/entities/Thread';
import ThreadModel from '../models/ThreadModel';

export class ThreadRepository implements IThreadRepository {
  public async save(thread: Thread): Promise<Error | void> {
    try {
      const threadDocument = new ThreadModel({
        threadId: thread.threadId,
        postId: thread.postId,
        post: thread.post,
        user: thread.user,
        commentCount: thread.commentCount,
      });

      await threadDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while creating a new thread');
    }
  }
}
