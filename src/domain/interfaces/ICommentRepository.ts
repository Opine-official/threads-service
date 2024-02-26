import { IComment } from '../../shared/interfaces/IComment';
import { Comment } from '../entities/Comment';

export interface ICommentRepository {
  findById(commentId: string): Promise<Comment | Error>;
  findMongoIdByCommentId(commentId: string): Promise<string | Error>;
  save(comment: Comment): Promise<string | Error>;
  update(comment: Comment): Promise<void | Error>;
  delete(commentId: string): Promise<void | Error>;
  getCommentsByPostId(postId: string): Promise<IComment[] | Error>;
  getCommentsAndPostsByUserId(userId: string): Promise<IComment[] | Error>;
  saveReplyByCommentId(
    commentId: string,
    reply: Comment,
  ): Promise<string | Error>;
  getRepliesByCommentId(commentId: string): Promise<IComment[] | Error>;
}
