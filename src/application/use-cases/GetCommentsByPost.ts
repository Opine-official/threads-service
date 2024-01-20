import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';
import { IComment } from '../../shared/interfaces/IComment';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetCommentsByPostRequestDTO {
  postId: string;
}

interface IGetCommentsByPostResult {
  comments: IComment[];
}

export class GetCommentsByPost
  implements IUseCase<IGetCommentsByPostRequestDTO, IGetCommentsByPostResult>
{
  constructor(private readonly _commentRepo: ICommentRepository) {}

  async execute(
    input: IGetCommentsByPostRequestDTO,
  ): Promise<IGetCommentsByPostResult | Error> {
    const comments = await this._commentRepo.getCommentsByPostId(input.postId);

    if (comments instanceof Error) {
      return comments;
    }

    return { comments };
  }
}
