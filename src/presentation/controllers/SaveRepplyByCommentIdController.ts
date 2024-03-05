import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { SaveReplyByCommentId } from '../../application/use-cases/SaveReplyByCommentId';

export class SaveReplyByCommentIdController implements IController {
  public constructor(private readonly _useCase: SaveReplyByCommentId) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const commentId = req.query.commentId;

    if (!commentId || typeof commentId !== 'string') {
      res.status(400).json({ error: 'Missing commentId' });
      return;
    }

    const result = await this._useCase.execute({
      commentId: commentId,
      reply: {
        postId: req.body.postId,
        userId: req.user.userId,
        content: req.body.content,
      },
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res
      .status(200)
      .send({ message: 'Replied successfully', replyId: result.replyId });
  }
}
