import { randomUUID } from 'crypto';

type ThreadParams = {
  threadId?: string;
  postId: string;
  post: string;
  user: string;
  commentCount: number;
  upVotes?: number;
  downVotes?: number;
};

export class Thread {
  threadId: string;
  postId: string;
  post: string;
  user: string;
  commentCount: number;
  upVotes?: number;
  downVotes?: number;

  constructor(params: ThreadParams) {
    this.threadId = params.threadId || randomUUID();
    this.postId = params.postId;
    this.post = params.post;
    this.user = params.user;
    this.commentCount = params.commentCount;
    this.upVotes = params.upVotes || 0;
    this.downVotes = params.downVotes || 0;
  }
}
