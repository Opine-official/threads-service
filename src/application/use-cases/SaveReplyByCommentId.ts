import { Comment } from '../../domain/entities/Comment';
import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface ISaveReplyByCommentIdRequestDTO {
  commentId: string;
  reply: {
    postId: string;
    userId: string;
    content: string;
  };
}

interface ISaveReplyByCommentIdResult {
  replyId: string;
}

export class SaveReplyByCommentId
  implements
    IUseCase<ISaveReplyByCommentIdRequestDTO, ISaveReplyByCommentIdResult>
{
  constructor(
    private readonly _commentRepo: ICommentRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _postRepo: IPostRepository,
  ) {}

  async execute(
    input: ISaveReplyByCommentIdRequestDTO,
  ): Promise<ISaveReplyByCommentIdResult | Error> {
    const mongoPostId = await this._postRepo.findMongoIdByPostId(
      input.reply.postId,
    );

    if (!mongoPostId) {
      return new Error('Post not found');
    }

    const mongoUserId = await this._userRepo.findMongoIdByUserId(
      input.reply.userId,
    );

    if (!mongoUserId) {
      return new Error('User not found');
    }

    const replyData = {
      postId: input.reply.postId,
      post: mongoPostId,
      user: mongoUserId,
      content: input.reply.content,
    };

    const reply = new Comment(replyData);

    const replyId = await this._commentRepo.saveReplyByCommentId(
      input.commentId,
      reply,
    );

    if (replyId instanceof Error) {
      return replyId;
    }

    return { replyId };
  }
}
