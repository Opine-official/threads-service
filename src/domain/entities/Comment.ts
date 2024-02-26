import { randomUUID } from 'crypto';

type CommentParams = {
  commentId?: string;
  postId: string;
  post: string;
  content: string;
  user: string;
  replies?: Comment[];
};

export class Comment {
  commentId: string;
  postId: string;
  post: string;
  content: string;
  user: string;
  replies?: Comment[];

  constructor(params: CommentParams) {
    this.commentId = params.commentId || randomUUID();
    this.postId = params.postId;
    this.post = params.post;
    this.content = params.content;
    this.user = params.user;
    this.replies = params.replies;
  }
}
