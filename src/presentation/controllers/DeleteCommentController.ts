import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { DeleteComment } from '../../application/use-cases/DeleteComment';

export class DeleteCommentController implements IController {
  public constructor(private readonly _useCase: DeleteComment) {}

  public async handle(req: Request, res: Response): Promise<void> {
    if (!req.query.commentId || typeof req.query.commentId !== 'string') {
      res.status(400).json({ error: 'Invalid commentId' });
      return;
    }

    const result = await this._useCase.execute({
      commentId: req.query.commentId,
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({
        error: 'Something went wrong',
      });
      return;
    }

    res
      .status(200)
      .send({ message: 'Deleted successfully', commentId: result.commentId });
  }
}
