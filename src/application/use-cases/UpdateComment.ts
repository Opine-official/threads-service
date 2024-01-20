import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IUpdateCommentDTO {
  commentId: string;
  content: string;
}

interface IUpdateCommentResult {
  commentId: string;
}

export class UpdateComment
  implements IUseCase<IUpdateCommentDTO, IUpdateCommentResult>
{
  constructor(private readonly _commentRepo: ICommentRepository) {}

  async execute(
    input: IUpdateCommentDTO,
  ): Promise<IUpdateCommentResult | Error> {
    const comment = await this._commentRepo.findById(input.commentId);

    if (comment instanceof Error) {
      return comment;
    }

    comment.content = input.content;

    const updateCommentResult = await this._commentRepo.update(comment);

    if (updateCommentResult instanceof Error) {
      return updateCommentResult;
    }

    return {
      commentId: comment.commentId,
    };
  }
}

export default UpdateComment;
