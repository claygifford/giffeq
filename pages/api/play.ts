import { NextApiRequest, NextApiResponse } from "next";
import { createRedisClientManualDispose } from "../../lib/clients/redis";
import { HttpMethods, hasToken } from "./methods";
import { Song } from "../../lib/types/song";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.post) return play(req, res);
  return res.status(405).send({ message: "405 Method Not Allowed" });
}

const play = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { playlistId, song } = req.body;
    //await using redisClient = await createRedisClient(req);
    const redisClient = await createRedisClientManualDispose(req);
    const { client, id } = redisClient;
    let history;

    try {
      history = await client.json.get(`playlists:${id}`, {
        path: `${playlistId}.history`,
      });
      (history as Song[]).push(song);
    } catch {
      history = [song];
    }

    await client.json.set(`playlists:${id}`, `${playlistId}.history`, history);
    res.status(201).send({ message: "201 Created" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
