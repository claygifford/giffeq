import { NextApiRequest, NextApiResponse } from "next";
import { createRedisClientManualDispose } from "../../lib/clients/redis";
import { HttpMethods, hasToken } from "./methods";
import { Song } from "../../lib/types/song";
import { Playlist } from "../../lib/types/playlist";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.get) return getNextSong(req, res);
  return res.status(405).send({ message: "405 Method Not Allowed" });
}

const getNextSong = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // how do I get the next song here?
    // do I query for it?
    // do I build generic genre playlists?
    const { playlistId } = req.query;
    //await using redisClient = await createRedisClient(req);
    const redisClient = await createRedisClientManualDispose(req);
    const { client, id } = redisClient;

    const playlist = (await client.json.get(`playlists:${id}`, {
      path: `${playlistId}`,
    })) as Playlist;

    if (playlist.history) {
      res.send((playlist.history as Song[]).pop());
    } else {
      res.send({});
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
