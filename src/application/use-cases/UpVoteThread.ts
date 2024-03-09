import { IThreadRepository } from '../../domain/interfaces/IThreadRepository';
import { ThreadVote } from '../../domain/entities/ThreadVote';
import { IUseCase } from '../../shared/interfaces/IUseCase';
import { IThreadVoteRepository } from '../../domain/interfaces/IThreadVoteRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

interface IUpVoteThreadRequestDTO {
  userId: string;
  threadId: string;
}

export class UpVoteThread implements IUseCase<IUpVoteThreadRequestDTO, void> {
  constructor(
    private readonly _threadRepo: IThreadRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _threadVoteRepo: IThreadVoteRepository,
  ) {}

  async execute(input: IUpVoteThreadRequestDTO): Promise<void | Error> {
    const user = await this._userRepo.findMongoIdByUserId(input.userId);

    if (!user) {
      return new Error('User not found');
    }

    const thread = await this._threadRepo.findMongoIdByThreadId(input.threadId);

    if (thread instanceof Error) {
      return thread;
    }

    const threadVote = new ThreadVote({
      userId: input.userId,
      user: user,
      threadId: input.threadId,
      thread: thread,
      type: 'up',
    });

    const saveThreadVoteResult =
      await this._threadVoteRepo.saveThreadVote(threadVote);

    if (saveThreadVoteResult instanceof Error) {
      return saveThreadVoteResult;
    }

    const upVote = this._threadRepo.upVote(input.threadId);

    if (upVote instanceof Error) {
      return upVote;
    }
  }
}
