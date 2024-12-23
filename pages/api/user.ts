import { NextApiRequest, NextApiResponse } from "next";
import { createRedisClient } from "../../lib/clients/redis";
import { HttpMethods, hasToken } from "./methods";
import { User } from "../../lib/types/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.get) return getUser(req, res);
  return res.status(405).send({ message: "405 Method Not Allowed" });
}

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await using redisClient = await createRedisClient(req);
    const { client, id } = redisClient;
    const user = (await client.json.get(`user:${id}`)) as User | null;
    res.status(200).send(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
