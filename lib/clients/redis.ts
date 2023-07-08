import { createClient } from 'redis';

export const createRedisClient = async () => {
  const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    },
  });
  
  await client.connect();
  return client;
};
