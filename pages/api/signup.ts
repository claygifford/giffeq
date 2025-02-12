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
    const { username, password, email } = req.body;

    const { userSub } = await Auth.signUp({
      username,
      password,
      attributes: {
        email, // optional
      },
      autoSignIn: {
        // optional - enables auto sign in after user is confirmed
        enabled: true,
      },
    });

    const token = generateToken();
    //await using redisClient = await createRedisClient();
    const redisClient = await createRedisClientManualDispose();    
    const { client } = redisClient;
    const user = {
      username: username,
      email: email,
      id: userSub,
    };

    await client.json.set(`user:${userSub}`, ".", user);
    await client.json.set(`playlists:${userSub}`, ".", {});

    await client.set(`token:${token}`, userSub);
    setCookie(res, "token", `${token}`, { maxAge: Year });
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
