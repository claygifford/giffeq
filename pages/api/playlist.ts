import { NextApiRequest, NextApiResponse } from 'next';
import { createRedisClient, createRedisClient123, createRedisClient456 } from '../../lib/clients/redis';
import { HttpMethods, generateToken, hasToken } from './methods';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.get) return getPlaylist(req, res);
  if (req.method === HttpMethods.post) return createPlaylist(req, res);
  if (req.method === HttpMethods.delete) return deletePlaylist(req, res);
  return res.status(405).send({ message: '405 Method Not Allowed' });
}

const getPlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const playlistId: string = req.query.playlistId
      ? (req.query.playlistId as string)
      : '';
    
    await using redisClient = await createRedisClient123(req);
    const {client, id} = redisClient;

    //using redisClient = await createRedisClient456(req);
    //console.log('hello world1');

    const playlist = await client.json.get(`playlists:${id}`, { path: playlistId });
    
    // const playlistId = generateToken();
    // const playlist = {
    //   id: playlistId,
    //   name: name,
    // };

    // await client.json.set(`playlists:${id}`, playlistId, playlist);
    res.status(200).send(playlist);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createPlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { name } = req.body;
    await using redisClient = await createRedisClient123(req);
    const {client, id} = redisClient;

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
    
    await using redisClient = await createRedisClient123(req);
    const {client, id} = redisClient;

    await client.json.del(`playlists:${id}`, playlistId as string);
    //console.log(`playlists:${id} || ${playlistId} ${JSON.stringify(req.body)}`);
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};