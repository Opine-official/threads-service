import { DeleteComment } from './src/application/use-cases/DeleteComment';
import { SaveComment } from './src/application/use-cases/SaveComment';
import UpdateComment from './src/application/use-cases/UpdateComment';
import { VerifyUser } from './src/application/use-cases/VerifyUser';
import { DatabaseConnection } from './src/infrastructure/database/Connection';
import { CommentRepository } from './src/infrastructure/repositories/CommentRepository';
import { PostRepository } from './src/infrastructure/repositories/PostRepository';
import { UserRepository } from './src/infrastructure/repositories/UserRepository';
import { Server } from './src/infrastructure/Server';
import run from './src/presentation/consumers/ThreadsConsumer';
import { DeleteCommentController } from './src/presentation/controllers/DeleteCommentController';
import { SaveCommentController } from './src/presentation/controllers/SaveCommentController';
import { UpdateCommentController } from './src/presentation/controllers/UpdateCommentController';
import { VerifyUserController } from './src/presentation/controllers/VerifyUserController';

export async function main(): Promise<void> {
  await DatabaseConnection.connect();

  const userRepo = new UserRepository();
  const postRepo = new PostRepository();
  const commentRepo = new CommentRepository();

  const verifyUser = new VerifyUser();
  const saveComment = new SaveComment(commentRepo, postRepo, userRepo);
  const updateComment = new UpdateComment(commentRepo);
  const deleteComment = new DeleteComment(commentRepo);

  const verifyUserController = new VerifyUserController(verifyUser);
  const saveCommentController = new SaveCommentController(saveComment);
  const updateCommentController = new UpdateCommentController(updateComment);
  const deleteCommentController = new DeleteCommentController(deleteComment);

  run();

  await Server.run(4003, {
    verifyUserController,
    saveCommentController,
    updateCommentController,
    deleteCommentController,
  });
}

main();
