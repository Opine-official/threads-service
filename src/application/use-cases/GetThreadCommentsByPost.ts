import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';
import { IComment } from '../../shared/interfaces/IComment';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetThreadCommentsByPostRequestDTO {
  postId: string;
  page: number;
}

interface IGetThreadCommentsByPostResult {
  comments: IComment[];
}

export class GetThreadCommentsByPost
  implements
    IUseCase<
      IGetThreadCommentsByPostRequestDTO,
      IGetThreadCommentsByPostResult
    >
{
  constructor(private readonly _commentRepo: ICommentRepository) {}

  async execute(
    input: IGetThreadCommentsByPostRequestDTO,
  ): Promise<IGetThreadCommentsByPostResult | Error> {
    const comments = await this._commentRepo.getThreadCommentsByPostId(
      input.postId,
      input.page,
      3,
    );

    if (comments instanceof Error) {
      return comments;
    }

    return { comments };
  }
}
