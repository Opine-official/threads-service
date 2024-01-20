import { Comment } from '../entities/Comment';

export interface ICommentRepository {
  findById(commentId: string): Promise<Comment | Error>;
  save(comment: Comment): Promise<void | Error>;
  update(comment: Comment): Promise<void | Error>;
  delete(commentId: string): Promise<void | Error>;
}
