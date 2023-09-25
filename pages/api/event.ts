import { NextApiRequest, NextApiResponse } from 'next';
import { createRedisClient } from '../../lib/clients/redis';
import { HttpMethods, generateToken, hasToken } from './methods';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.delete) return deleteEvent(req, res);
  return res.status(405).send({ message: '405 Method Not Allowed' });
}

const deleteEvent = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { playlistId, index } = req.query;
    const { client, id } = await createRedisClient(req);
    let history;

    history = await client.json.get(`playlists:${id}`, {
      path: `${playlistId}.history`,
    });

    history.splice(index, 1);

    await client.json.set(`playlists:${id}`, `${playlistId}.history`, history);
    res.status(200).send({ message: '200 OK' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
