import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { GetRepliesByCommentId } from '../../application/use-cases/GetRepliesByCommentId';

export class GetRepliesByCommentIdController implements IController {
  public constructor(private readonly _useCase: GetRepliesByCommentId) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const commentId = req.query.commentId;

    if (!commentId || typeof commentId !== 'string') {
      res.status(400).json({ error: 'Missing commentId' });
      return;
    }

    const result = await this._useCase.execute({
      commentId: commentId,
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).json(result);
  }
}
