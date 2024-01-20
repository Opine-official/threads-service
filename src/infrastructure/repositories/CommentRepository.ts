import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';
import { Comment } from '../../domain/entities/Comment';
import CommentModel from '../models/CommentModel';

export class CommentRepository implements ICommentRepository {
  public async findById(commentId: string): Promise<Comment | Error> {
    try {
      const commentDocument = await CommentModel.findOne({
        commentId: commentId,
      });

      if (!commentDocument) {
        return new Error('Comment not found');
      }

      const commentData = {
        commentId: commentDocument.commentId,
        postId: commentDocument.postId,
        user: commentDocument.user.toString(),
        post: commentDocument.post.toString(),
        content: commentDocument.content,
      };

      return new Comment(commentData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while retrieving the comment');
    }
  }

  public async save(comment: Comment): Promise<void | Error> {
    try {
      const commentDocument = new CommentModel({
        commentId: comment.commentId,
        postId: comment.postId,
        user: comment.user,
        content: comment.content,
      });

      await commentDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while creating a new comment');
    }
  }

  public async update(comment: Comment): Promise<void | Error> {
    try {
      await CommentModel.updateOne(
        {
          commentId: comment.commentId,
        },
        {
          content: comment.content,
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while updating the comment');
    }
  }

  public async delete(commentId: string): Promise<void | Error> {
    try {
      await CommentModel.deleteOne({
        commentId: commentId,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }

      return new Error('Something went wrong while deleting');
    }
  }
}
