import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { SaveComment } from '../../application/use-cases/SaveComment';

export class SaveCommentController implements IController {
  public constructor(private readonly _useCase: SaveComment) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const result = await this._useCase.execute({
      userId: req.user.userId,
      postId: req.body.postId,
      content: req.body.content,
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res
      .status(200)
      .send({ message: 'Commented successfully', commentId: result.commentId });
  }
}
