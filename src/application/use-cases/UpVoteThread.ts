import {
  IThreadRepository,
  votes,
} from '../../domain/interfaces/IThreadRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

interface IUpVoteThreadRequestDTO {
  userId: string;
  threadId: string;
}

export class UpVoteThread implements IUseCase<IUpVoteThreadRequestDTO, votes> {
  constructor(
    private readonly _threadRepo: IThreadRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(input: IUpVoteThreadRequestDTO): Promise<votes | Error> {
    const user = await this._userRepo.findMongoIdByUserId(input.userId);

    if (!user) {
      return new Error('User not found');
    }

    const upVote = this._threadRepo.upVote(input.threadId, user);

    if (upVote instanceof Error) {
      return upVote;
    }

    return upVote;
  }
}
