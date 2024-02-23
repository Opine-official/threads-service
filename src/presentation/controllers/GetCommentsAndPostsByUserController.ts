import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { GetCommentsAndPostsByUser } from '../../application/use-cases/GetCommentsAndPostsByUser';

export class GetCommentsAndPostsByUserController implements IController {
  public constructor(private readonly _useCase: GetCommentsAndPostsByUser) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const userId = req.query.userId;

    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'Invalid user id' });
      return;
    }

    const result = await this._useCase.execute({ userId: userId });

    if (result instanceof Error) {
      res.status(400).json({ error: result.message });
      return;
    }

    res.status(200).json(result);
  }
}
