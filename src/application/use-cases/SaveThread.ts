import { Thread } from '../../domain/entities/Thread';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { IThreadRepository } from '../../domain/interfaces/IThreadRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface ISaveThreadRequestDTO {
  userId: string;
  threadId?: string;
  postId: string;
  commentCount: number;
}

interface ISaveThreadDTO {
  threadId: string;
  postId: string;
  post: string;
  user: string;
  commentCount: number;
}

interface ISaveThreadResult {
  threadId: string;
}

export class SaveThread
  implements IUseCase<ISaveThreadRequestDTO, ISaveThreadResult>
{
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _postRepo: IPostRepository,
    private readonly _threadRepo: IThreadRepository,
  ) {}

  async execute(
    input: ISaveThreadRequestDTO,
  ): Promise<ISaveThreadResult | Error> {
    const mongoUserId = await this._userRepo.findMongoIdByUserId(input.userId);

    if (!mongoUserId) {
      return new Error('User not found');
    }

    const mongoPostId = await this._postRepo.findMongoIdByPostId(input.postId);

    if (!mongoPostId) {
      return new Error('Post not found');
    }

    const threadData = {
      postId: input.postId,
      post: mongoPostId,
      user: mongoUserId,
      commentCount: input.commentCount,
    };

    const thread: ISaveThreadDTO = new Thread(threadData);
    const saveThreadResult = await this._threadRepo.save(thread);

    if (saveThreadResult instanceof Error) {
      return saveThreadResult;
    }

    return {
      threadId: thread.threadId,
    };
  }
}
