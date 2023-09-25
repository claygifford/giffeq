import { NextApiRequest, NextApiResponse } from 'next';
import { createRedisClient } from '../../lib/clients/redis';
import { HttpMethods, hasToken } from './methods';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.get) return getPlaylists(req, res);
  return res.status(405).send({ message: '405 Method Not Allowed' });
}

const getPlaylists = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { client, id } = await createRedisClient(req);
    const playlists = await client.json.get(`playlists:${id}`);
    const items = Object.values(playlists);
    res.status(200).send(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
