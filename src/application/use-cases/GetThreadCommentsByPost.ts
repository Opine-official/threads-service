import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';
import { IComment } from '../../shared/interfaces/IComment';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetThreadCommentsByPostRequestDTO {
  postId: string;
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
    const comments = await this._commentRepo.getCommentsByPostId(input.postId);

    if (comments instanceof Error) {
      return comments;
    }

    return { comments };
  }
}
