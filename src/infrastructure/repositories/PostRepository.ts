import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { Post } from '../../domain/entities/Post';
import PostModel from '../models/PostModel';

export class PostRepository implements IPostRepository {
  public async save(post: Post): Promise<Error | void> {
    try {
      const postDocument = new PostModel({
        postId: post.postId,
        title: post.title,
        description: post.description,
        user: post.user,
        tags: post.tags,
        slug: post.slug,
      });

      await postDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while creating a new post');
    }
  }

  public async delete(slug: string): Promise<void | Error> {
    try {
      await PostModel.deleteOne({
        slug: slug,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }

      return new Error('Something went wrong while deleting');
    }
  }

  public async findMongoIdByPostId(postId: string): Promise<string | null> {
    const userDocument = await PostModel.findOne({ postId });
    return userDocument ? userDocument._id.toString() : null;
  }

  public async findUserIdByPostId(postId: string): Promise<string | null> {
    const postDocument = (await PostModel.findOne({ postId: postId }).populate(
      'user',
      'userId',
    )) as unknown as { user: { userId: string } } | null;
    return postDocument ? postDocument?.user?.userId?.toString() : null;
  }

  public async findPostMetaDataByPostId(postId: string): Promise<Post | null> {
    const postDocument = await PostModel.findOne({
      postId: postId,
    });

    if (!postDocument) {
      return null;
    }

    return new Post({
      postId: postDocument.postId,
      title: postDocument.title,
      description: postDocument.description,
      user: postDocument.user.toString(),
      tags: postDocument.tags,
      slug: postDocument.slug,
    });
  }
}
