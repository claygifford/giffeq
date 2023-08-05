import { NextApiRequest, NextApiResponse } from 'next';
import { createRedisClient } from '../../lib/clients/redis';
import { HttpMethods, generateToken, hasToken } from './methods';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.post) return play(req, res);
  return res.status(405).send({ message: '405 Method Not Allowed' });
}

const play = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.cookies['token'];

    const { playlistId, song } = req.body;    
    const client = await createRedisClient();
    const id = await client.get(`token:${token}`);
    const playlist = await client.json.get(`playlists:${id}`, playlistId);
    //playlist['history'] = [song];
    //await client.lPush(`playlists:${id}`, playlistId, playlist);
    // const token = req.cookies['token'];

    // const client = await createRedisClient();
    // const id = await client.get(`token:${token}`);

    // const playlists = await client.json.get(`playlists:${id}`);
    // const count = Object.keys(playlists).length + 1;
    // const playlistId = generateToken();
    // const playlist = {
    //   id: playlistId,
    //   name: `Playlist ${count}`,
    // };

    await client.json.set(`playlists:${id}`, `${playlistId}.history`, [song]);
    res.status(201).send({ message: '201 Created' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
