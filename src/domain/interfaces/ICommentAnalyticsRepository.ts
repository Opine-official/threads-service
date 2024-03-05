import { CommentAnalytics } from '../entities/CommentAnalytics';

export type CommentAnalyticsByDate = {
  date: Date;
  count: number;
};

export interface ICommentAnalyticsRepository {
  get(commentAnalyticsId: string): Promise<CommentAnalytics | Error>;
  save(commentAnalytics: CommentAnalytics): Promise<void | Error>;
  update(commentAnalytics: CommentAnalytics): Promise<void | Error>;
  delete(commentAnalyticsId: string): Promise<void | Error>;
  getAnalytics(): Promise<CommentAnalytics[] | Error>;
  getAllCommentAnalyticsByDate(): Promise<CommentAnalyticsByDate[] | Error>;
}
