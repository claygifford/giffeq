import { NextApiRequest, NextApiResponse } from 'next';
import { createRedisClient } from '../../lib/clients/redis';
import { HttpMethods, generateToken, hasToken } from './methods';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.post) return createPlaylist(req, res);
  if (req.method === HttpMethods.delete) return deletePlaylist(req, res);
  return res.status(405).send({ message: '405 Method Not Allowed' });
}

const createPlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.cookies['token'];
    const { name } = req.body;

    const client = await createRedisClient();
    const id = await client.get(`token:${token}`);
    
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
    const token = req.cookies['token'];

    const {
      query: { playlistId },
    } = req;

    const client = await createRedisClient();
    const id = await client.get(`token:${token}`);

    await client.json.del(`playlists:${id}`, playlistId as string);
    //console.log(`playlists:${id} || ${playlistId} ${JSON.stringify(req.body)}`);
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};