import { DeleteComment } from './src/application/use-cases/DeleteComment';
import { DownVoteThread } from './src/application/use-cases/DownVoteThread';
import { GetAllCommentAnalytics } from './src/application/use-cases/GetAllCommentAnalytics';
import { GetCommentsAndPostsByUser } from './src/application/use-cases/GetCommentsAndPostsByUser';
import { GetCommentsByPost } from './src/application/use-cases/GetCommentsByPost';
import { GetRepliesByCommentId } from './src/application/use-cases/GetRepliesByCommentId';
import { GetThreadCommentsByPost } from './src/application/use-cases/GetThreadCommentsByPost';
import { GetThreads } from './src/application/use-cases/GetThreads';
import { SaveComment } from './src/application/use-cases/SaveComment';
import { SaveReplyByCommentId } from './src/application/use-cases/SaveReplyByCommentId';
import UpdateComment from './src/application/use-cases/UpdateComment';
import { UpVoteThread } from './src/application/use-cases/UpVoteThread';
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
import { DownVoteThreadController } from './src/presentation/controllers/DownVoteThreadController';
import { GetAllCommentAnalyticsController } from './src/presentation/controllers/GetAllCommentAnalyticsController';
import { GetCommentsAndPostsByUserController } from './src/presentation/controllers/GetCommentsAndPostsByUserController';
import { GetCommentsByPostController } from './src/presentation/controllers/GetCommentsByPostController';
import { GetRepliesByCommentIdController } from './src/presentation/controllers/GetRepliesByCommentIdController';
import { GetThreadCommentsByPostController } from './src/presentation/controllers/GetThreadCommentsByPostController';
import { GetThreadsController } from './src/presentation/controllers/GetThreadsController';
import { SaveCommentController } from './src/presentation/controllers/SaveCommentController';
import { SaveReplyByCommentIdController } from './src/presentation/controllers/SaveRepplyByCommentIdController';
import { UpdateCommentController } from './src/presentation/controllers/UpdateCommentController';
import { UpVoteThreadController } from './src/presentation/controllers/UpVoteThreadController';
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
  const getThreads = new GetThreads(threadRepo, userRepo);
  const getCommentsAndPostsByUser = new GetCommentsAndPostsByUser(
    commentRepo,
    userRepo,
  );
  const getAllCommentAnalytics = new GetAllCommentAnalytics(
    commentAnalyticsRepo,
  );
  const saveReplyByCommentId = new SaveReplyByCommentId(
    commentRepo,
    userRepo,
    postRepo,
  );
  const getRepliesByCommentId = new GetRepliesByCommentId(commentRepo);
  const getThreadCommentsByPost = new GetThreadCommentsByPost(commentRepo);
  const upVoteThread = new UpVoteThread(threadRepo, userRepo);
  const downVoteThread = new DownVoteThread(threadRepo, userRepo);

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

  const saveReplyByCommentIdController = new SaveReplyByCommentIdController(
    saveReplyByCommentId,
  );

  const getRepliesByCommentIdController = new GetRepliesByCommentIdController(
    getRepliesByCommentId,
  );
  const getThreadCommentsByPostController =
    new GetThreadCommentsByPostController(getThreadCommentsByPost);

  const upVoteThreadController = new UpVoteThreadController(upVoteThread);

  const downVoteThreadController = new DownVoteThreadController(downVoteThread);
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
    saveReplyByCommentIdController,
    getRepliesByCommentIdController,
    getThreadCommentsByPostController,
    upVoteThreadController,
    downVoteThreadController,
  });
}

main();
