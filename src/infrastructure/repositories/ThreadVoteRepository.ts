import { IThreadVoteRepository } from '../../domain/interfaces/IThreadVoteRepository';
import { ThreadVote } from '../../domain/entities/ThreadVote';
import { ThreadVoteModel } from '../models/ThreadVoteModel';

export class ThreadVoteRepository implements IThreadVoteRepository {
  public async saveThreadVote(threadVote: ThreadVote): Promise<void | Error> {
    try {
      const threadVoteDocument = new ThreadVoteModel({
        threadVoteId: threadVote.threadVoteId,
        userId: threadVote.userId,
        user: threadVote.user,
        threadId: threadVote.threadId,
        thread: threadVote.thread,
        type: threadVote.type,
      });

      await threadVoteDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while creating a new thread vote');
    }
  }
}
