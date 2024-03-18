import { Types } from 'mongoose';
import { IThreadRepository } from '../../domain/interfaces/IThreadRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { PopulatedThreadModel } from '../../infrastructure/models/ThreadModel';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetThreadsRequestDTO {
  userId: string;
  // Allowing undefined for now as personalization is not implemented yet
  // Also make sure to update IPostRepository.ts once implemented
}

interface IGetThreadsResult {
  threads: PopulatedThreadModel[];
}

export class GetThreads
  implements IUseCase<IGetThreadsRequestDTO, IGetThreadsResult>
{
  constructor(
    private readonly _threadRepo: IThreadRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(
    input: IGetThreadsRequestDTO,
  ): Promise<IGetThreadsResult | Error> {
    const mongoUserId = await this._userRepo.findMongoIdByUserId(input.userId);

    if (!mongoUserId) {
      return new Error('User not found');
    }

    const threads = await this._threadRepo.findRecommendedThreads(
      input.userId,
      mongoUserId as unknown as Types.ObjectId,
    );

    if (threads instanceof Error) {
      return threads;
    }

    return { threads };
  }
}
