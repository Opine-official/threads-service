export interface IComment {
  commentId: string;
  postId: string;
  content: string;
  user: {
    userId: string;
    name: string;
    username: string;
    profile: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
