import { NextApiRequest, NextApiResponse } from "next";
import { createRedisClient } from "../../lib/clients/redis";
import { HttpMethods, generateToken, hasToken } from "./methods";
import { Playlist } from "../../lib/types/playlist";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.get) return getPlaylist(req, res);
  if (req.method === HttpMethods.post) return createPlaylist(req, res);
  if (req.method === HttpMethods.delete) return deletePlaylist(req, res);
  return res.status(405).send({ message: "405 Method Not Allowed" });
}

const getPlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const playlistId: string = req.query.playlistId
      ? (req.query.playlistId as string)
      : "";

    await using redisClient = await createRedisClient(req);
    const { client, id } = redisClient;

    const playlist = (await client.json.get(`playlists:${id}`, {
      path: playlistId,
    })) as Playlist;

    res.status(200).send(playlist);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createPlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { name } = req.body;
    await using redisClient = await createRedisClient(req);
    const { client, id } = redisClient;

    //const playlists = await client.json.get(`playlists:${id}`);
    const playlistId = generateToken();
    const playlist = {
      id: playlistId,
      name: name,
    };

    await client.json.set(`playlists:${id}`, playlistId, playlist);
    res.status(201).send(playlist);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deletePlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      query: { playlistId },
    } = req;

    await using redisClient = await createRedisClient(req);
    const { client, id } = redisClient;

    await client.json.del(`playlists:${id}`, playlistId as string);
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
