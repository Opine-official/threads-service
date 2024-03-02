import { IThreadRepository } from '../../domain/interfaces/IThreadRepository';
import { Thread } from '../../domain/entities/Thread';
import ThreadModel, { PopulatedThreadModel } from '../models/ThreadModel';

export class ThreadRepository implements IThreadRepository {
  public async save(thread: Thread): Promise<Error | void> {
    try {
      const threadDocument = new ThreadModel({
        threadId: thread.threadId,
        postId: thread.postId,
        post: thread.post,
        user: thread.user,
        commentCount: thread.commentCount,
      });

      await threadDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while creating a new thread');
    }
  }

  public async findRecommendedThreads(
    userId: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<Error | PopulatedThreadModel[]> {
    console.log(userId);

    const skip = (page - 1) * limit;

    try {
      const threads = await ThreadModel.find()
        .sort({ commentCount: -1 })
        .limit(5)
        .populate('user')
        .populate('post')
        .populate({
          path: 'comments',
          options: { skip, limit },
          populate: [
            {
              path: 'user',
              model: 'User',
            },
            {
              path: 'post',
              model: 'Post',
            },
          ],
        })
        .exec();

      const filteredThreads = threads.filter(
        (thread) => thread.post !== null,
      ) as unknown as PopulatedThreadModel[];

      return filteredThreads;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while finding threads');
    }
  }

  public async findThreadIdByPostId(postId: string): Promise<Error | string> {
    try {
      const result = await ThreadModel.findOne({ postId: postId }).select(
        'threadId',
      );
      if (!result) {
        throw new Error('Thread not found');
      }

      return result.threadId as string;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while finding threadId');
    }
  }

  public async updateComment(
    threadId: string,
    commentId: string,
  ): Promise<Error | void> {
    try {
      await ThreadModel.findOneAndUpdate(
        { threadId: threadId },
        {
          $inc: { commentCount: 1 },
          $push: { comments: commentId },
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while updating comment count');
    }
  }
}
