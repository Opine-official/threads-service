import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IDeleteCommentDTO {
  commentId: string;
}

interface IDeleteCommentResult {
  commentId: string;
}

export class DeleteComment
  implements IUseCase<IDeleteCommentDTO, IDeleteCommentResult>
{
  constructor(private readonly _commentRepo: ICommentRepository) {}

  async execute(
    input: IDeleteCommentDTO,
  ): Promise<IDeleteCommentResult | Error> {
    const deleteCommentResult = await this._commentRepo.delete(input.commentId);

    if (deleteCommentResult instanceof Error) {
      return deleteCommentResult;
    }

    return {
      commentId: input.commentId,
    };
  }
}
