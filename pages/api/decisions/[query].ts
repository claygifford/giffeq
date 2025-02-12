import { NextApiRequest, NextApiResponse } from "next";
import { createRedisClientManualDispose } from "../../../lib/clients/redis";
import { HttpMethods, hasToken } from "../methods";
import { Decision } from "../../../lib/types/song";
import { Playlist } from "../../../lib/types/playlist";
import { EmptyQuery, Query } from "../../../lib/types/query";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const { method } = req;

  if (!hasToken(req, res)) return;

  if (method === HttpMethods.get && query === "query") {
    return getDecisions(req, res);
  } else if (HttpMethods.put && query === "addSong") {
    return addSongToDecisions(req, res);
  } else if (HttpMethods.delete && query === "decision") {
    return deleteDecision(req, res);
  }

  return res.status(405).send({ message: "405 Method Not Allowed" });
}

const getDecisions = async (req: NextApiRequest, res: NextApiResponse) => {
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

    if (playlist.decisions) {
      let decisions = playlist.decisions;
      res.send({
        start,
        items: decisions.slice(start, count),
        count: count,
        total: decisions.length,
      } as Query<Decision>);
    } else {
      res.send(EmptyQuery);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const addSongToDecisions = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const { playlistId } = req.query;
    const { song, like } = req.body;
    //await using redisClient = await createRedisClient(req);
    const redisClient = await createRedisClientManualDispose(req);
    const { client, id } = redisClient;

    const playlist = (await client.json.get(`playlists:${id}`, {
      path: `${playlistId}`,
    })) as Playlist;

    const { decisions = [] } = playlist;
    console.log(`${JSON.stringify(playlist.decisions)}`);

    decisions.push({
      like,
      song,
    });
    console.log(`${JSON.stringify(playlist.decisions)}`);

    await client.json.set(
      `playlists:${id}`,
      `${playlistId}.decisions`,
      decisions,
    );

    res.send({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteDecision = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { playlistId, index } = req.query;
    //await using redisClient = await createRedisClient(req);
    const redisClient = await createRedisClientManualDispose(req);
    const { client, id } = redisClient;

    let decisions;

    decisions = await client.json.get(`playlists:${id}`, {
      path: `${playlistId}.decisions`,
    });

    decisions.splice(index, 1);

    await client.json.set(
      `playlists:${id}`,
      `${playlistId}.decisions`,
      decisions,
    );
    res.status(200).send({ message: "200 OK" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
