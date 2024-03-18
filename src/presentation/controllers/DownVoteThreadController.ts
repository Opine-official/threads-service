import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { DownVoteThread } from '../../application/use-cases/DownVoteThread';

export class DownVoteThreadController implements IController {
  public constructor(private readonly _useCase: DownVoteThread) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const result = await this._useCase.execute({
      userId: req.body.userId,
      threadId: req.body.threadId,
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).send({
      message: 'Thread down voted successfully',
      votes: result,
    });
  }
}
