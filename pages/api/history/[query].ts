import { NextApiRequest, NextApiResponse } from "next";
import { createRedisClientManualDispose } from "../../../lib/clients/redis";
import { HttpMethods, hasToken } from "../methods";
import { Song } from "../../../lib/types/song";
import { Playlist } from "../../../lib/types/playlist";
import { EmptyQuery, Query } from "../../../lib/types/query";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const { method } = req;

  if (!hasToken(req, res)) return;

  if (method === HttpMethods.get && query === "query") {
    return getHistory(req, res);
  } else if (method === "PUT" && query === "addSong") {
    return addSongToHistory(req, res);
  }

  return res.status(405).send({ message: "405 Method Not Allowed" });
}

const getHistory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { playlistId } = req.query;
    const count = +(req.query.count ?? 50);
    const start = +(req.query.start ?? 0);
    //await using redisClient = await createRedisClient(req);
    const redisClient = await createRedisClientManualDispose(req);
    const { client, id } = redisClient;

    const playlist = (await client.json.get(`playlists:${id}`, {
      path: `${playlistId}`,
    })) as Playlist;

    if (playlist.history) {
      let songs = playlist.history;
      res.send({
        start,
        items: songs.slice(start, count),
        count: count,
        total: songs.length,
      } as Query<Song>);
    } else {
      res.send(EmptyQuery);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const addSongToHistory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { playlistId } = req.query;
    const { song } = req.body;
    //await using redisClient = await createRedisClient(req);
    const redisClient = await createRedisClientManualDispose(req);
    const { client, id } = redisClient;

    const playlist = (await client.json.get(`playlists:${id}`, {
      path: `${playlistId}`,
    })) as Playlist;

    const { history = [] } = playlist;
    console.log(`${JSON.stringify(playlist.history)}`);

    history.push(song);
    console.log(`${JSON.stringify(playlist.history)}`);

    await client.json.set(`playlists:${id}`, `${playlistId}.history`, history);

    res.send({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
