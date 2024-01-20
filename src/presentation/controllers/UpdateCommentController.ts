import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { UpdateComment } from '../../application/use-cases/UpdateComment';

export class UpdateCommentController implements IController {
  public constructor(private readonly _useCase: UpdateComment) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const result = await this._useCase.execute({
      commentId: req.body.commentId,
      content: req.body.content,
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).send({
      message: 'Comment updated successfully',
      commentId: result.commentId,
    });
  }
}
