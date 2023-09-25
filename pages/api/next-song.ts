import { NextApiRequest, NextApiResponse } from 'next';
import { createRedisClient } from '../../lib/clients/redis';
import { HttpMethods, generateToken, hasToken } from './methods';
import { Song } from '../../lib/types/song';
import isEmpty from 'lodash/isEmpty';
import { Playlist } from '../../lib/types/playlist';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.get) return getNextSong(req, res);
  return res.status(405).send({ message: '405 Method Not Allowed' });
}

const getNextSong = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // how do I get the next song here?
    // do I query for it?
    // do I build generic genre playlists?
    const { playlistId } = req.query;
    const { client, id } = await createRedisClient(req);
    const playlist = await client.json.get(`playlists:${id}`, {
      path: `${playlistId}`,
    }) as Playlist;

    if (playlist.history) {
      res.send((playlist.history as Song[]).pop());
    } else {
      res.send({});
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
