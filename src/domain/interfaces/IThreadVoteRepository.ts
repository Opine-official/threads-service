import { ThreadVote } from '../entities/ThreadVote';

export interface IThreadVoteRepository {
  saveThreadVote(threadVote: ThreadVote): Promise<void | Error>;
}
