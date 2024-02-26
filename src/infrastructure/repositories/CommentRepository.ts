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

  public async save(comment: Comment): Promise<string | Error> {
    try {
      const commentDocument = new CommentModel({
        commentId: comment.commentId,
        postId: comment.postId,
        post: comment.post,
        user: comment.user,
        content: comment.content,
      });

      await commentDocument.save();

      return commentDocument._id.toString();
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

  public async getCommentsAndPostsByUserId(
    userId: string,
  ): Promise<IComment[] | Error> {
    try {
      const comments = await CommentModel.find({
        user: userId,
      })
        .sort({ createdAt: -1 })
        .populate('post')
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
        post: comment.post as unknown as {
          postId: string;
          title: string;
          slug: string;
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

  public async saveReplyByCommentId(
    commentId: string,
    reply: Comment,
  ): Promise<string | Error> {
    try {
      const commentDocument = await CommentModel.findOne({
        commentId: commentId,
      });

      if (!commentDocument) {
        throw new Error('Comment not found');
      }

      commentDocument.replies.push({
        commentId: reply.commentId,
        postId: reply.postId,
        post: reply.post,
        user: reply.user,
        content: reply.content,
      });

      await commentDocument.save();

      return reply.commentId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }

      return new Error('Something went wrong while saving the reply');
    }
  }

  public async getRepliesByCommentId(
    commentId: string,
  ): Promise<IComment[] | Error> {
    try {
      const commentDocument = await CommentModel.findOne({
        commentId: commentId,
      }).populate('replies.user');

      if (!commentDocument) {
        return new Error('Comment not found');
      }

      return commentDocument.replies.map((reply) => ({
        commentId: reply.commentId,
        postId: reply.postId,
        content: reply.content,
        user: reply.user as unknown as {
          userId: string;
          name: string;
          username: string;
          profile: string;
        },
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }

      return new Error('Something went wrong while retrieving the replies');
    }
  }
}
