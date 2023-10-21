import { NextApiRequest, NextApiResponse } from 'next';
import { createRedisClient, createRedisClient123 } from '../../lib/clients/redis';
import { HttpMethods, generateToken, hasToken } from './methods';
import { Song } from '../../lib/types/song';
import { Preferences } from '../../lib/types/playlist';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.post) return setPreference(req, res);
  return res.status(405).send({ message: '405 Method Not Allowed' });
}

const setPreference = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //const { playlistId } = req.query;    
    await using redisClient = await createRedisClient123(req);
    const {client, id} = redisClient;

    let preferences: Preferences;
    try {
      preferences = await client.json.get(`user:${id}`, {
        path: `preferences`,
      }) as Preferences;
    } catch {
      preferences = {} as Preferences;
    }
    
    res.send(preferences);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};