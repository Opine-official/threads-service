import { randomUUID } from 'crypto';

type CommentParams = {
  commentId?: string;
  post: string;
  content: string;
  user: string;
};

export class Comment {
  commentId: string;
  post: string;
  content: string;
  user: string;

  constructor(params: CommentParams) {
    this.commentId = params.commentId || randomUUID();
    this.post = params.post;
    this.content = params.content;
    this.user = params.user;
  }
}
