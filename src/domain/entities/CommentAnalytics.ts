import { randomUUID } from 'crypto';

type CommentAnalyticsParams = {
  commentAnalyticsId?: string;
  commentId: string;
  comment: string;
  likeCount?: number;
  replyCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class CommentAnalytics {
  commentAnalyticsId: string;
  commentId: string;
  comment: string;
  likeCount: number;
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    commentAnalyticsId = randomUUID(),
    commentId,
    comment,
    likeCount = 0,
    replyCount = 0,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: CommentAnalyticsParams) {
    this.commentAnalyticsId = commentAnalyticsId;
    this.commentId = commentId;
    this.comment = comment;
    this.likeCount = likeCount;
    this.replyCount = replyCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
