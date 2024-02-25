import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { GetAllCommentAnalytics } from '../../application/use-cases/GetAllCommentAnalytics';

export class GetAllCommentAnalyticsController implements IController {
  public constructor(private readonly _useCase: GetAllCommentAnalytics) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const result = await this._useCase.execute();

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).send({
      message: 'Comment analytics retrieved successfully',
      commentAnalytics: result,
    });
  }
}
