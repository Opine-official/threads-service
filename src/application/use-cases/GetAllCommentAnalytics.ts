import {
  ICommentAnalyticsRepository,
  CommentAnalyticsByDate,
} from '../../domain/interfaces/ICommentAnalyticsRepository';

import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetAllCommentAnalyticsResult extends CommentAnalyticsByDate {}

export class GetAllCommentAnalytics
  implements IUseCase<null, IGetAllCommentAnalyticsResult[]>
{
  public constructor(
    private readonly _commentAnalyticsRepo: ICommentAnalyticsRepository,
  ) {}

  public async execute(): Promise<IGetAllCommentAnalyticsResult[] | Error> {
    const commentAnalytics =
      await this._commentAnalyticsRepo.getAllCommentAnalyticsByDate();

    if (commentAnalytics instanceof Error) {
      return new Error(commentAnalytics.message);
    }

    return commentAnalytics;
  }
}
