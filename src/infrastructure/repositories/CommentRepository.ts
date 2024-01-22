import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';
import { Comment } from '../../domain/entities/Comment';
import CommentModel from '../models/CommentModel';
import { IComment } from '../../shared/interfaces/IComment';

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

  public async findMongoIdByCommentId(
    commentId: string,
  ): Promise<string | Error> {
    try {
      const commentDocument = await CommentModel.findOne({
        commentId: commentId,
      });

      if (!commentDocument) {
        return new Error('Comment not found');
      }

      return commentDocument._id.toString();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error(
        'Something went wrong while retrieving the mongoId of the comment',
      );
    }
  }

  public async save(comment: Comment): Promise<void | Error> {
    try {
      const commentDocument = new CommentModel({
        commentId: comment.commentId,
        postId: comment.postId,
        post: comment.post,
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

  public async getCommentsByPostId(
    postId: string,
  ): Promise<IComment[] | Error> {
    try {
      const comments = await CommentModel.find({
        postId: postId,
      })
        .sort({ createdAt: -1 })
        .populate('user');

      return comments.map((comment) => ({
        commentId: comment.commentId,
        postId: comment.postId,
        content: comment.content,
        user: comment.user as unknown as {
          userId: string;
          name: string;
          username: string;
          profile: string;
        },
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }

      return new Error('Something went wrong while retrieving the comments');
    }
  }
}
