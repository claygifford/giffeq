import { NextApiRequest, NextApiResponse } from "next";
import { createRedisClientManualDispose } from "../../../lib/clients/redis";
import { HttpMethods, hasToken } from "../methods";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.post) return setPreference(req, res);
  return res.status(405).send({ message: "405 Method Not Allowed" });
}

const setPreference = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { preferences } = req.body;

    //await using redisClient = await createRedisClient(req);
    const redisClient = await createRedisClientManualDispose(req);
    const { client, id } = redisClient;

    await client.json.set(`user:${id}`, `preferences`, preferences);
    res.send({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
