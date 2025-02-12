import type { NextApiRequest, NextApiResponse } from "next";
import { Year, setCookie } from "../../lib/cookies/cookies";
import { Amplify, Auth } from "aws-amplify";
import awsExports from "../../src/aws-exports";
import { createRedisClientManualDispose } from "../../lib/clients/redis";
import { generateToken } from "./methods";

Amplify.configure(awsExports);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "405 Method Not Allowed" });
    return;
  }

  try {
    const { username, password } = req.body;
    const user = await Auth.signIn(username, password);
    //await using redisClient = await createRedisClient();
    const redisClient = await createRedisClientManualDispose();
    const { client } = redisClient;
    const item = await client.json.get(`user:${user.attributes.sub}`);
    if (!item) {
      res.status(500).json({ message: "User does not exist." });
      return;
    }
    const token = generateToken();
    await client.set(`token:${token}`, user.attributes.sub);
    setCookie(res, "token", `${token}`, { maxAge: Year });
    res.status(200).json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
