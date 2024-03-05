import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';
import { IComment } from '../../shared/interfaces/IComment';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetRepliesByCommentIdRequestDTO {
  commentId: string;
}

interface IGetRepliesByCommentIdResult {
  replies: IComment[];
}

export class GetRepliesByCommentId
  implements
    IUseCase<IGetRepliesByCommentIdRequestDTO, IGetRepliesByCommentIdResult>
{
  constructor(private readonly _commentRepo: ICommentRepository) {}

  async execute(
    input: IGetRepliesByCommentIdRequestDTO,
  ): Promise<IGetRepliesByCommentIdResult | Error> {
    const replies = await this._commentRepo.getRepliesByCommentId(
      input.commentId,
    );
    if (replies instanceof Error) {
      return replies;
    }
    return { replies };
  }
}
