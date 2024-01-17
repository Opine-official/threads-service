import { Post } from '../../domain/entities/Post';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface ISavePostDTO {
  postId: string;
  title: string;
  description: string;
  user: string;
  tags: string[];
  slug: string;
}

interface ISavePostResult {
  postId: string;
}

class SavePost implements IUseCase<ISavePostDTO, ISavePostResult> {
  constructor(
    private readonly _postRepo: IPostRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(input: ISavePostDTO): Promise<ISavePostResult | Error> {
    const mongoId = await this._userRepo.findMongoIdByUserId(input.user);

    if (!mongoId) {
      return new Error('User not found');
    }

    const postData = {
      postId: input.postId,
      title: input.title,
      description: input.description,
      user: mongoId,
      tags: input.tags,
      slug: input.slug,
    };

    const post = new Post(input);
    const savePostResult = await this._postRepo.save(postData);

    if (savePostResult instanceof Error) {
      return savePostResult;
    }

    return {
      postId: post.postId,
    };
  }
}

export default SavePost;
