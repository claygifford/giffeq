import type { NextApiRequest, NextApiResponse } from "next";
import { clearCookie } from "../../lib/cookies/cookies";
import { Amplify, Auth } from "aws-amplify";
import awsExports from "../../src/aws-exports";
import { createRedisClient } from "../../lib/clients/redis";

Amplify.configure(awsExports);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(405).send({ message: "405 Method Not Allowed" });
    return;
  }
  const token = req.cookies["token"];
  await Auth.signOut();
  await using redisClient = await createRedisClient();
  const { client } = redisClient;
  await client.del(`token:${token}`);
  clearCookie(res, "token");
  res.status(200).json({ message: "successful log out" });
}
