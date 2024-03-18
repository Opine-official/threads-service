import {
  IThreadRepository,
  votes,
} from '../../domain/interfaces/IThreadRepository';
import { Thread } from '../../domain/entities/Thread';
import ThreadModel, { PopulatedThreadModel } from '../models/ThreadModel';
import { Types } from 'mongoose';

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
    mongoUserId: Types.ObjectId,
  ): Promise<Error | PopulatedThreadModel[]> {
    try {
      const threads = await ThreadModel.find()
        .lean()
        .sort({
          commentCount: -1,
          upVotes: -1,
          downVotes: 1,
        })
        .limit(5)
        .populate('user')
        .populate('post')
        .exec();

      const filteredThreads = threads.filter(
        (thread) => thread.post !== null,
      ) as unknown as PopulatedThreadModel[];

      const highlightedThreads = filteredThreads.map((thread) => {
        return {
          ...thread,
          hasUpVoted: thread.upVoters
            ?.map((voter) => voter.toString())
            .includes(mongoUserId.toString()),
          hasDownVoted: thread.downVoters
            ?.map((voter) => voter.toString())
            .includes(mongoUserId.toString()),
        };
      });

      return highlightedThreads;
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

  public async findMongoIdByThreadId(
    threadId: string,
  ): Promise<Error | string> {
    try {
      const result = await ThreadModel.findOne({ threadId: threadId }).select(
        '_id',
      );
      if (!result) {
        throw new Error('Thread not found');
      }

      return result._id.toString();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while finding threadId');
    }
  }

  public async upVote(threadId: string, user: string): Promise<Error | votes> {
    try {
      const thread = await ThreadModel.findOne({ threadId: threadId });
      if (!thread) {
        return new Error('Thread not found');
      }
      const hasUpVoted = thread.upVoters
        .map((voter) => voter.toString())
        .includes(user.toString());
      const hasDownVoted = thread.downVoters
        .map((voter) => voter.toString())
        .includes(user.toString());

      if (hasUpVoted) {
        await ThreadModel.findOneAndUpdate(
          { threadId: threadId },
          { $inc: { upVotes: -1 }, $pull: { upVoters: user } },
        );
      } else {
        if (hasDownVoted) {
          await ThreadModel.findOneAndUpdate(
            { threadId: threadId },
            { $inc: { downVotes: -1 }, $pull: { downVoters: user } },
          );
        }
        await ThreadModel.findOneAndUpdate(
          { threadId: threadId },
          { $inc: { upVotes: 1 }, $push: { upVoters: user } },
        );
      }

      const updatedThread = await ThreadModel.findOne({ threadId: threadId });

      if (!updatedThread) {
        return new Error('Updated thread not found');
      }

      return {
        upVotes: updatedThread.upVotes,
        downVotes: updatedThread.downVotes,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while up voting');
    }
  }

  public async downVote(
    threadId: string,
    user: string,
  ): Promise<Error | votes> {
    try {
      const thread = await ThreadModel.findOne({ threadId: threadId });
      if (!thread) {
        return new Error('Thread not found');
      }
      const hasDownVoted = thread.downVoters
        .map((voter) => voter.toString())
        .includes(user.toString());
      const hasUpVoted = thread.upVoters
        .map((voter) => voter.toString())
        .includes(user.toString());

      if (hasDownVoted) {
        await ThreadModel.findOneAndUpdate(
          { threadId: threadId },
          { $inc: { downVotes: -1 }, $pull: { downVoters: user } },
        );
      } else {
        if (hasUpVoted) {
          await ThreadModel.findOneAndUpdate(
            { threadId: threadId },
            { $inc: { upVotes: -1 }, $pull: { upVoters: user } },
          );
        }
        await ThreadModel.findOneAndUpdate(
          { threadId: threadId },
          { $inc: { downVotes: 1 }, $push: { downVoters: user } },
        );
      }
      const updatedThread = await ThreadModel.findOne({ threadId: threadId });

      if (!updatedThread) {
        return new Error('Updated thread not found');
      }

      return {
        upVotes: updatedThread.upVotes,
        downVotes: updatedThread.downVotes,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while down voting');
    }
  }
}
