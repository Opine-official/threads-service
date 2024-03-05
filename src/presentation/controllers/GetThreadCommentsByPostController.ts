import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { GetThreadCommentsByPost } from '../../application/use-cases/GetThreadCommentsByPost';

export class GetThreadCommentsByPostController implements IController {
  public constructor(private readonly _useCase: GetThreadCommentsByPost) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const postId = req.query.postId;
    const page = Number(req.query.page);

    if (!postId || typeof postId !== 'string') {
      res.status(400).json({ error: 'Invalid post id' });
      return;
    }

    if (!page || typeof page !== 'number') {
      res.status(400).json({ error: 'Invalid page' });
      return;
    }

    const result = await this._useCase.execute({
      postId: postId,
      page: page,
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).send({ comments: result.comments });
  }
}
