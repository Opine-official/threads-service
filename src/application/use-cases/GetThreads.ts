import { IThreadRepository } from '../../domain/interfaces/IThreadRepository';
import { PopulatedThreadModel } from '../../infrastructure/models/ThreadModel';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetThreadsRequestDTO {
  userId: string | undefined;
  // Allowing undefined for now as personalization is not implemented yet
  // Also make sure to update IPostRepository.ts once implemented
}

interface IGetThreadsResult {
  threads: PopulatedThreadModel[];
}

export class GetThreads
  implements IUseCase<IGetThreadsRequestDTO, IGetThreadsResult>
{
  constructor(private readonly _threadRepo: IThreadRepository) {}

  async execute(
    input: IGetThreadsRequestDTO,
  ): Promise<IGetThreadsResult | Error> {
    const threads = await this._threadRepo.findRecommendedThreads(input.userId);

    if (threads instanceof Error) {
      return threads;
    }

    return { threads };
  }
}
