import { NextApiRequest } from 'next';
import { createClient } from 'redis';

export const createRedisClient = async (req?: NextApiRequest) => {
  const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    },
  });
  
  await client.connect();
  if (req) {
    const token = req.cookies['token'];
    const id = await client.get(`token:${token}`);
    return {id, client};
  }
  return {client};
};
