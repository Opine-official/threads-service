import { randomUUID } from 'crypto';

type voteType = 'up' | 'down';

type ThreadVoteParams = {
  threadVoteId?: string;
  threadId: string;
  thread: string;
  userId: string;
  user: string;
  type: voteType;
};

export class ThreadVote {
  threadVoteId: string;
  threadId: string;
  thread: string;
  userId: string;
  user: string;
  type: voteType;

  constructor(params: ThreadVoteParams) {
    this.threadVoteId = params.threadVoteId || randomUUID();
    this.threadId = params.threadId;
    this.thread = params.thread;
    this.userId = params.userId;
    this.user = params.user;
    this.type = params.type;
  }
}
