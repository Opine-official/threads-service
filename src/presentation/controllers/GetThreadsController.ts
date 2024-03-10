import { Request, Response } from 'express';
import { GetThreads } from '../../application/use-cases/GetThreads';
import { IController } from '../../shared/interfaces/IController';

export class GetThreadsController implements IController {
  public constructor(private readonly _useCase: GetThreads) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const userId = req.query.userId?.toString();

    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const result = await this._useCase.execute({ userId: userId });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: result.message });
      return;
    }

    res.status(200).json(result);
  }
}
