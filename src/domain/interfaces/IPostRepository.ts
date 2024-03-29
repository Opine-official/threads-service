import { Post } from '../entities/Post';

export interface IPostRepository {
  save(post: Post): Promise<void | Error>;
  delete(slug: string): Promise<void | Error>;
  findMongoIdByPostId(postId: string): Promise<string | null>;
  findUserIdByPostId(postId: string): Promise<string | null>;
  findPostMetaDataByPostId(postId: string): Promise<Post | null>;
}
