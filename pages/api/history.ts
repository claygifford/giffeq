import { NextApiRequest, NextApiResponse } from 'next';
import { createRedisClient } from '../../lib/clients/redis';
import { HttpMethods, hasToken } from './methods';
import { Song } from '../../lib/types/song';
import { Playlist } from '../../lib/types/playlist';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.get) return getHistory(req, res);
  return res.status(405).send({ message: '405 Method Not Allowed' });
}

const getHistory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { playlistId } = req.query;
    const { client, id } = await createRedisClient(req);

    const playlist = (await client.json.get(`playlists:${id}`, {
      path: `${playlistId}`,
    })) as Playlist;

    if (playlist.history) {
      res.send(playlist.history as Song[]);
    } else {
      res.send([]);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
