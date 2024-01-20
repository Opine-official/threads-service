type PostParams = {
  postId: string;
  title: string;
  description: string;
  user: string;
  tags: string[];
  slug: string;
};

export class Post {
  postId: string;
  title: string;
  description: string;
  user: string;
  tags: string[];
  slug: string;

  constructor(params: PostParams) {
    this.postId = params.postId;
    this.title = params.title;
    this.description = params.description;
    this.user = params.user;
    this.tags = params.tags;
    this.slug = params.slug;
  }
}
