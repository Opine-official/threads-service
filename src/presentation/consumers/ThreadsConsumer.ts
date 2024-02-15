import { DeletePost } from '../../application/use-cases/DeletePost';
import { SavePost } from '../../application/use-cases/SavePost';
import { SaveThread } from '../../application/use-cases/SaveThread';
import { SaveUser } from '../../application/use-cases/SaveUser';
import kafka from '../../infrastructure/brokers/kafka/config';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { ThreadRepository } from '../../infrastructure/repositories/ThreadRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

const consumer = kafka.consumer({ groupId: 'threads-consumer-group' });
const producer = kafka.producer();

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-register-topic' });
  await consumer.subscribe({ topic: 'post-create-topic' });
  await consumer.subscribe({ topic: 'post-delete-topic' });
  await producer.connect();

  const userRepository = new UserRepository();
  const postRepository = new PostRepository();
  const threadRepository = new ThreadRepository();

  const saveUser = new SaveUser(userRepository);
  const savePost = new SavePost(postRepository, userRepository);
  const deletePost = new DeletePost(postRepository);

  const saveThread = new SaveThread(
    userRepository,
    postRepository,
    threadRepository,
  );

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        'reached here': true,
        topic,
        partition,
        value: message?.value?.toString(),
      });

      if (!message?.value?.toString()) {
        return;
      }

      if (topic === 'user-register-topic') {
        const userData = JSON.parse(message?.value?.toString());

        const saveUserResult = await saveUser.execute(userData);

        if (saveUserResult instanceof Error) {
          console.error(saveUserResult);
          return;
        }
      } else if (topic === 'post-create-topic') {
        const postData = JSON.parse(message?.value?.toString());

        const savePostResult = await savePost.execute(postData);

        if (savePostResult instanceof Error) {
          console.error(savePostResult);
          return;
        }

        // Once isThreadsEnabled option is configured, below code will be executed conditionally

        const saveThreadResult = await saveThread.execute({
          userId: postData.user,
          postId: postData.postId,
          commentCount: 0,
        });

        if (saveThreadResult instanceof Error) {
          console.error(saveThreadResult);
          return;
        }
      } else if (topic === 'post-delete-topic') {
        const slug = JSON.parse(message?.value?.toString());

        const deletePostResult = await deletePost.execute({ slug: slug });

        if (deletePostResult instanceof Error) {
          console.error(deletePostResult);
          try {
            const sendResult = await producer.send({
              topic: 'post-delete-response-topic',
              messages: [
                {
                  key: 'post-delete-response-key',
                  value: JSON.stringify({
                    success: false,
                    message: 'post not deleted',
                  }),
                },
              ],
            });
            console.log('Message sent, error:', sendResult);
          } catch (error) {
            console.error('Error sending message:', error);
          }
          return;
        }

        try {
          const sendResult = await producer.send({
            topic: 'post-delete-response-topic',
            messages: [
              {
                key: 'post-delete-response-key',
                value: JSON.stringify({
                  success: true,
                  message: 'post deleted',
                }),
              },
            ],
          });
          console.log('Message sent, success:', sendResult);
        } catch (error) {
          console.error('Error sending message:', error);
        }

        console.log('send acknowledgement');
      }

      console.log('consumer end');
    },
  });
};

run().catch(console.error);

export default run;
