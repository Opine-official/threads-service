import { DeleteComment } from './src/application/use-cases/DeleteComment';
import { GetAllCommentAnalytics } from './src/application/use-cases/GetAllCommentAnalytics';
import { GetCommentsAndPostsByUser } from './src/application/use-cases/GetCommentsAndPostsByUser';
import { GetCommentsByPost } from './src/application/use-cases/GetCommentsByPost';
import { GetThreads } from './src/application/use-cases/GetThreads';
import { SaveComment } from './src/application/use-cases/SaveComment';
import UpdateComment from './src/application/use-cases/UpdateComment';
import { VerifyUser } from './src/application/use-cases/VerifyUser';
import { KafkaMessageProducer } from './src/infrastructure/brokers/kafka/kafkaMessageProducer';
import { DatabaseConnection } from './src/infrastructure/database/Connection';
import { CommentAnalyticsRepository } from './src/infrastructure/repositories/CommentAnalyticsRepository';
import { CommentRepository } from './src/infrastructure/repositories/CommentRepository';
import { PostRepository } from './src/infrastructure/repositories/PostRepository';
import { ThreadRepository } from './src/infrastructure/repositories/ThreadRepository';
import { UserRepository } from './src/infrastructure/repositories/UserRepository';
import { Server } from './src/infrastructure/Server';
import run from './src/presentation/consumers/ThreadsConsumer';
import { DeleteCommentController } from './src/presentation/controllers/DeleteCommentController';
import { GetAllCommentAnalyticsController } from './src/presentation/controllers/GetAllCommentAnalyticsController';
import { GetCommentsAndPostsByUserController } from './src/presentation/controllers/GetCommentsAndPostsByUserController';
import { GetCommentsByPostController } from './src/presentation/controllers/GetCommentsByPostController';
import { GetThreadsController } from './src/presentation/controllers/GetThreadsController';
import { SaveCommentController } from './src/presentation/controllers/SaveCommentController';
import { UpdateCommentController } from './src/presentation/controllers/UpdateCommentController';
import { VerifyUserController } from './src/presentation/controllers/VerifyUserController';

export async function main(): Promise<void> {
  await DatabaseConnection.connect();

  const userRepo = new UserRepository();
  const postRepo = new PostRepository();
  const commentRepo = new CommentRepository();
  const threadRepo = new ThreadRepository();
  const commentAnalyticsRepo = new CommentAnalyticsRepository();
  const messageProducer = new KafkaMessageProducer();

  const verifyUser = new VerifyUser();
  const saveComment = new SaveComment(
    commentRepo,
    postRepo,
    userRepo,
    threadRepo,
    commentAnalyticsRepo,
    messageProducer,
  );
  const updateComment = new UpdateComment(commentRepo);
  const deleteComment = new DeleteComment(commentRepo);
  const getCommentsByPost = new GetCommentsByPost(commentRepo);
  const getThreads = new GetThreads(threadRepo);
  const getCommentsAndPostsByUser = new GetCommentsAndPostsByUser(
    commentRepo,
    userRepo,
  );
  const getAllCommentAnalytics = new GetAllCommentAnalytics(
    commentAnalyticsRepo,
  );

  const verifyUserController = new VerifyUserController(verifyUser);
  const saveCommentController = new SaveCommentController(saveComment);
  const updateCommentController = new UpdateCommentController(updateComment);
  const deleteCommentController = new DeleteCommentController(deleteComment);
  const getCommentsByPostController = new GetCommentsByPostController(
    getCommentsByPost,
  );
  const getThreadsController = new GetThreadsController(getThreads);
  const getCommentsAndPostsByUserController =
    new GetCommentsAndPostsByUserController(getCommentsAndPostsByUser);

  const getAllCommentAnalyticsController = new GetAllCommentAnalyticsController(
    getAllCommentAnalytics,
  );

  run();

  await Server.run(4003, {
    verifyUserController,
    saveCommentController,
    updateCommentController,
    deleteCommentController,
    getCommentsByPostController,
    getCommentsAndPostsByUserController,
    getThreadsController,
    getAllCommentAnalyticsController,
  });
}

main();
