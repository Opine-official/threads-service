import express from 'express';
import cors from 'cors';
import { VerifyUserController } from '../presentation/controllers/VerifyUserController';
import cookieParser from 'cookie-parser';
import { authenticateRole } from '@opine-official/authentication';
import { SaveCommentController } from '../presentation/controllers/SaveCommentController';
import { authenticateAdmin } from '@opine-official/authentication';
import { UpdateCommentController } from '../presentation/controllers/UpdateCommentController';
import { DeleteCommentController } from '../presentation/controllers/DeleteCommentController';
import { GetCommentsByPostController } from '../presentation/controllers/GetCommentsByPostController';
import { GetThreadsController } from '../presentation/controllers/GetThreadsController';
import { GetCommentsAndPostsByUserController } from '../presentation/controllers/GetCommentsAndPostsByUserController';
import { GetAllCommentAnalyticsController } from '../presentation/controllers/GetAllCommentAnalyticsController';
import { SaveReplyByCommentIdController } from '../presentation/controllers/SaveRepplyByCommentIdController';
import { GetRepliesByCommentIdController } from '../presentation/controllers/GetRepliesByCommentIdController';
import { GetThreadCommentsByPostController } from '../presentation/controllers/GetThreadCommentsByPostController';

interface ServerControllers {
  verifyUserController: VerifyUserController;
  saveCommentController: SaveCommentController;
  updateCommentController: UpdateCommentController;
  deleteCommentController: DeleteCommentController;
  getCommentsByPostController: GetCommentsByPostController;
  getThreadsController: GetThreadsController;
  getCommentsAndPostsByUserController: GetCommentsAndPostsByUserController;
  getAllCommentAnalyticsController: GetAllCommentAnalyticsController;
  saveReplyByCommentIdController: SaveReplyByCommentIdController;
  getRepliesByCommentIdController: GetRepliesByCommentIdController;
  getThreadCommentsByPostController: GetThreadCommentsByPostController;
}

const allowedOrigins = [
  'https://localhost:3000',
  'https://www.opine.ink',
  'https://opine.ink',
];

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
  credentials: true,
};

export class Server {
  public static async run(
    port: number,
    controllers: ServerControllers,
  ): Promise<void> {
    const app = express();
    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/test', (req, res) => res.send('Threads service is running'));

    app.get('/verifyUser', (req, res) => {
      controllers.verifyUserController.handle(req, res);
    });

    app.get('/', (req, res) => {
      controllers.getThreadsController.handle(req, res);
    });

    app
      .get('/comment', (req, res) => {
        console.log(req, res);
        // logic to fetch single comment goes here
      })
      .post('/comment', authenticateRole('user'), (req, res) => {
        controllers.saveCommentController.handle(req, res);
      })
      .put('/comment', authenticateRole('user'), (req, res) => {
        controllers.updateCommentController.handle(req, res);
      })
      .delete('/comment', authenticateRole('user'), (req, res) => {
        controllers.deleteCommentController.handle(req, res);
      });

    app
      .post('/reply', authenticateRole('user'), (req, res) => {
        controllers.saveReplyByCommentIdController.handle(req, res);
      })
      .get('/replies', (req, res) => {
        controllers.getRepliesByCommentIdController.handle(req, res);
      });

    app.get('/comments', (req, res) => {
      controllers.getCommentsByPostController.handle(req, res);
    });

    app.get('/commentsAndPosts', (req, res) => {
      controllers.getCommentsAndPostsByUserController.handle(req, res);
    });

    app.get('/analytics', authenticateAdmin, (req, res) => {
      controllers.getAllCommentAnalyticsController.handle(req, res);
    });

    app.get('/threadComments', authenticateRole('user'), (req, res) => {
      controllers.getThreadCommentsByPostController.handle(req, res);
    });

    app.listen(port, () => {
      console.log(`Server is running in ${port}`);
    });
  }
}
