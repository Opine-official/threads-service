import express from 'express';
import cors from 'cors';
import { VerifyUserController } from '../presentation/controllers/VerifyUserController';
import cookieParser from 'cookie-parser';
import { SaveCommentController } from '../presentation/controllers/SaveCommentController';
import { authenticateToken } from '@opine-official/authentication';
import { UpdateCommentController } from '../presentation/controllers/UpdateCommentController';
import { DeleteCommentController } from '../presentation/controllers/DeleteCommentController';
import { GetCommentsByPostController } from '../presentation/controllers/GetCommentsByPostController';
import { GetThreadsController } from '../presentation/controllers/GetThreadsController';

interface ServerControllers {
  verifyUserController: VerifyUserController;
  saveCommentController: SaveCommentController;
  updateCommentController: UpdateCommentController;
  deleteCommentController: DeleteCommentController;
  getCommentsByPostController: GetCommentsByPostController;
  getThreadsController: GetThreadsController;
}

const corsOptions = {
  origin: 'https://localhost:3000',
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
      .post('/comment', authenticateToken, (req, res) => {
        controllers.saveCommentController.handle(req, res);
      })
      .put('/comment', authenticateToken, (req, res) => {
        controllers.updateCommentController.handle(req, res);
      })
      .delete('/comment', authenticateToken, (req, res) => {
        controllers.deleteCommentController.handle(req, res);
      });

    app.get('/comments', (req, res) => {
      controllers.getCommentsByPostController.handle(req, res);
    });

    app.listen(port, () => {
      console.log(`Server is running in ${port}`);
    });
  }
}
