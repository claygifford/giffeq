import { NextApiRequest, NextApiResponse } from 'next';
import { createRedisClient, createRedisClient123 } from '../../lib/clients/redis';
import { HttpMethods, hasToken } from './methods';
import { Song } from '../../lib/types/song';
import { Playlist } from '../../lib/types/playlist';
import { EmptyQuery, Query } from '../../lib/types/query';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.get) return getHistory(req, res);
  return res.status(405).send({ message: '405 Method Not Allowed' });
}

const getHistory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { playlistId } = req.query;
    const count = +req.query.count ?? 50;
    const start = +req.query.start ?? 0;
    await using redisClient = await createRedisClient123(req);
    const {client, id} = redisClient;

    const playlist = (await client.json.get(`playlists:${id}`, {
      path: `${playlistId}`,
    })) as Playlist;

    if (playlist.history) {
      let songs = playlist.history as Song[];
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
