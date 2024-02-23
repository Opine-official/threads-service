import { ICommentRepository } from '../../domain/interfaces/ICommentRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IComment } from '../../shared/interfaces/IComment';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetCommentsAndPostsByUserDTO {
  userId: string;
}

interface IGetCommentsByPostResult {
  comments: IComment[];
}

export class GetCommentsAndPostsByUser
  implements IUseCase<IGetCommentsAndPostsByUserDTO, IGetCommentsByPostResult>
{
  constructor(
    private readonly _commentRepo: ICommentRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(
    input: IGetCommentsAndPostsByUserDTO,
  ): Promise<IGetCommentsByPostResult | Error> {
    const user = await this._userRepo.findMongoIdByUserId(input.userId);

    if (!user) {
      return new Error('User not found');
    }

    const comments = await this._commentRepo.getCommentsAndPostsByUserId(user);

    if (comments instanceof Error) {
      return comments;
    }

    return { comments };
  }
}
