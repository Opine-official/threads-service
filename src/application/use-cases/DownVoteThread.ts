import {
  IThreadRepository,
  votes,
} from '../../domain/interfaces/IThreadRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

interface IDownVoteThreadRequestDTO {
  userId: string;
  threadId: string;
}

export class DownVoteThread
  implements IUseCase<IDownVoteThreadRequestDTO, votes>
{
  constructor(
    private readonly _threadRepo: IThreadRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(input: IDownVoteThreadRequestDTO): Promise<votes | Error> {
    const user = await this._userRepo.findMongoIdByUserId(input.userId);

    if (!user) {
      return new Error('User not found');
    }

    const downVote = this._threadRepo.downVote(input.threadId, user);

    if (downVote instanceof Error) {
      return downVote;
    }

    return downVote;
  }
}
