import { ICommentAnalyticsRepository } from '../../domain/interfaces/ICommentAnalyticsRepository';
import { CommentAnalytics } from '../../domain/entities/CommentAnalytics';
import { CommentAnalyticsModel } from '../models/CommentAnalyticsModel';
import { CommentAnalyticsByDate } from '../../domain/interfaces/ICommentAnalyticsRepository';

export class CommentAnalyticsRepository implements ICommentAnalyticsRepository {
  public async get(
    commentAnalyticsId: string,
  ): Promise<CommentAnalytics | Error> {
    try {
      const commentAnalytics = await CommentAnalyticsModel.findOne({
        commentAnalyticsId,
      });

      if (!commentAnalytics) {
        throw new Error('Comment analytics not found');
      }

      return {
        commentAnalyticsId: commentAnalytics.commentAnalyticsId,
        commentId: commentAnalytics.commentId,
        comment: commentAnalytics.comment as unknown as string,
        likeCount: commentAnalytics.likeCount,
        replyCount: commentAnalytics.replyCount,
        createdAt: commentAnalytics.createdAt,
        updatedAt: commentAnalytics.updatedAt,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while getting comment analytics');
    }
  }

  public async save(commentAnalytics: CommentAnalytics): Promise<void | Error> {
    try {
      const commentAnalyticsDocument = new CommentAnalyticsModel({
        commentAnalyticsId: commentAnalytics.commentAnalyticsId,
        commentId: commentAnalytics.commentId,
        comment: commentAnalytics.comment,
        likeCount: commentAnalytics.likeCount,
        replyCount: commentAnalytics.replyCount,
        createdAt: commentAnalytics.createdAt,
        updatedAt: commentAnalytics.updatedAt,
      });

      await commentAnalyticsDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while saving comment analytics');
    }
  }

  public async update(
    commentAnalytics: CommentAnalytics,
  ): Promise<void | Error> {
    try {
      await CommentAnalyticsModel.updateOne(
        { commentAnalyticsId: commentAnalytics.commentAnalyticsId },
        {
          commentId: commentAnalytics.commentId,
          comment: commentAnalytics.comment,
          likeCount: commentAnalytics.likeCount,
          replyCount: commentAnalytics.replyCount,
          createdAt: commentAnalytics.createdAt,
          updatedAt: commentAnalytics.updatedAt,
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while updating comment analytics');
    }
  }

  public async delete(commentAnalyticsId: string): Promise<void | Error> {
    try {
      await CommentAnalyticsModel.deleteOne({ commentAnalyticsId });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while deleting comment analytics');
    }
  }

  public async getAnalytics(): Promise<CommentAnalytics[] | Error> {
    try {
      const commentAnalytics = await CommentAnalyticsModel.find();

      return commentAnalytics.map((commentAnalytics) => ({
        commentAnalyticsId: commentAnalytics.commentAnalyticsId,
        commentId: commentAnalytics.commentId,
        comment: commentAnalytics.comment as unknown as string,
        likeCount: commentAnalytics.likeCount,
        replyCount: commentAnalytics.replyCount,
        createdAt: commentAnalytics.createdAt,
        updatedAt: commentAnalytics.updatedAt,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while getting comment analytics');
    }
  }

  public async getAllCommentAnalyticsByDate(): Promise<
    CommentAnalyticsByDate[] | Error
  > {
    try {
      const commentAnalytics = await CommentAnalyticsModel.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
      ]);

      return commentAnalytics.map((commentAnalytics) => ({
        date: new Date(
          commentAnalytics._id.year,
          commentAnalytics._id.month - 1,
          commentAnalytics._id.day,
        ),
        count: commentAnalytics.count,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error(
        'Something went wrong while getting comment analytics by date',
      );
    }
  }
}
