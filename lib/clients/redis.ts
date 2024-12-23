import { NextApiRequest } from "next";
import { createClient } from "redis";

/* @ts-expect-error */
Symbol.dispose ??= Symbol("Symbol.dispose");
/* @ts-expect-error */
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");

// export const createRedisClient = async (req?: NextApiRequest) => {
//   const client = createClient({
//     username: process.env.REDIS_USERNAME,
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//       host: process.env.REDIS_HOST,
//       port: +process.env.REDIS_PORT,
//     },
//   });

//   await client.connect();
//   if (req) {
//     const token = req.cookies['token'];
//     const id = await client.get(`token:${token}`);
//     return { id, client };
//   }
//   return { client };
// };

export const createRedisClient = async (
  req?: NextApiRequest,
): Promise<{
  client: ReturnType<typeof createClient>;
  id?: string;
  [Symbol.asyncDispose]: () => Promise<void>;
}> => {
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
    const token = req.cookies["token"];
    const id = await client.get(`token:${token}`);
    return {
      client,
      id,
      [Symbol.asyncDispose]: async () => {
        await client.quit();
      },
    };
  }

  return {
    client,
    [Symbol.asyncDispose]: async () => {
      //await client.quit();
    },
  };
};
