import { Comment } from '../../domain/entities/Comment';
import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { IThreadRepository } from '../../domain/interfaces/IThreadRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface ISaveCommentRequestDTO {
  userId: string;
  postId: string;
  content: string;
}

interface ISaveCommentDTO {
  commentId: string;
  postId: string;
  content: string;
  user: string;
  post: string;
}

interface ISaveCommentResult {
  commentId: string;
}

export class SaveComment
  implements IUseCase<ISaveCommentRequestDTO, ISaveCommentResult>
{
  constructor(
    private readonly _commentRepo: ICommentRepository,
    private readonly _postRepo: IPostRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _threadRepo: IThreadRepository,
  ) {}

  async execute(
    input: ISaveCommentRequestDTO,
  ): Promise<ISaveCommentResult | Error> {
    const mongoUserId = await this._userRepo.findMongoIdByUserId(input.userId);

    if (!mongoUserId) {
      return new Error('User not found');
    }

    const mongoPostId = await this._postRepo.findMongoIdByPostId(input.postId);

    if (!mongoPostId) {
      return new Error('Post not found');
    }

    const commentData = {
      postId: input.postId,
      post: mongoPostId,
      user: mongoUserId,
      content: input.content,
    };

    const comment: ISaveCommentDTO = new Comment(commentData);
    const saveCommentResult = await this._commentRepo.save(comment);

    if (saveCommentResult instanceof Error) {
      return saveCommentResult;
    }

    const threadId = await this._threadRepo.findThreadIdByPostId(input.postId);

    if (threadId instanceof Error) {
      return threadId;
    }

    const commentMongoId = await this._commentRepo.findMongoIdByCommentId(
      comment.commentId,
    );

    if (commentMongoId instanceof Error) {
      return commentMongoId;
    }

    const commentUpdateResult = await this._threadRepo.updateComment(
      threadId,
      commentMongoId,
    );

    if (commentUpdateResult instanceof Error) {
      return commentUpdateResult;
    }

    return {
      commentId: comment.commentId,
    };
  }
}
