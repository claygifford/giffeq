import { NextApiRequest, NextApiResponse } from "next";
import { createRedisClientManualDispose } from "../../../lib/clients/redis";
import { HttpMethods, hasToken } from "../methods";
import { Album, Artist, DecisionData, Song } from "../../../lib/types/song";
import { Playlist } from "../../../lib/types/playlist";
import { EmptyQuery, Query } from "../../../lib/types/query";
import { getAlbums, getArtists, getTracks, setMusic } from "../actions";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const { method } = req;

  if (!hasToken(req, res)) return;

  if (method === HttpMethods.get && query === "query") {
    return getDecisions(req, res);
  } else if (HttpMethods.put && query === "addSong") {
    return addSongToDecisions(req, res);
  } else if (HttpMethods.delete && query === "decision") {
    return deleteDecision(req, res);
  }

  return res.status(405).send({ message: "405 Method Not Allowed" });
}

const getDecisions = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { playlistId } = req.query;
    const count = +(req.query.count ?? 50);
    const start = +(req.query.start ?? 0);
    //await using redisClient = await createRedisClient(req);
    const redisClient = await createRedisClientManualDispose(req);

    const { client, id } = redisClient;

    const playlist = (await client.json.get(`playlists:${id}`, {
      path: `${playlistId}`,
    })) as Playlist;

    if (playlist.decisions) {
      let songs = playlist.decisions;
      const decisions = songs.slice(start, count);

      var group = decisions.reduce(
        (map, obj) => {
          map[obj.uri] = obj as DecisionData;
          return map;
        },
        {} as { [key: string]: DecisionData },
      );

      const tracks = await getTracks(client, Object.keys(group));
      const trackGroups = tracks.reduce(
        (map, obj) => {
          map[obj.uri] = obj;
          return map;
        },
        {} as { [key: string]: Song },
      );

      const albums = await getAlbums(
        client,
        decisions.map((i) => i.album_uri),
      );
      const albumGroups = albums.reduce(
        (map, obj) => {
          map[obj.uri] = obj;
          return map;
        },
        {} as { [key: string]: Album },
      );

      const artists = await getArtists(
        client,
        decisions
          .map((i) => i.artists_uri)
          .reduce((pre, cur) => {
            return pre.concat(cur);
          }),
      );

      const artistGroups = artists.reduce(
        (map, obj) => {
          map[obj.uri] = obj;
          return map;
        },
        {} as { [key: string]: Artist },
      );

      decisions.forEach((h) => {
        group[h.uri].track = trackGroups[h.uri];
        group[h.uri].album = albumGroups[h.album_uri];
        group[h.uri].artists = h.artists_uri.map((i) => artistGroups[i]);
      });

      const items = Object.values(group);

      res.send({
        start,
        items: items,
        count: count,
        total: items.length,
      } as Query<DecisionData>);
    } else {
      res.send(EmptyQuery);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const addSongToDecisions = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const { playlistId } = req.query;
    const { song, like } = req.body;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { album, artists, available_markets, ...track } = song;

    //await using redisClient = await createRedisClient(req);
    const redisClient = await createRedisClientManualDispose(req);
    const { client, id } = redisClient;

    const playlist = (await client.json.get(`playlists:${id}`, {
      path: `${playlistId}`,
    })) as Playlist;

    const { decisions = [] } = playlist;
    const found = decisions.findIndex((i) => i.uri === song.uri);

    if (found !== -1) {
      const item = decisions[found];
      item.like = like;
      item.timestamp = Date.now();
      decisions.splice(0, 0, decisions.splice(found, 1)[0]);
    } else {
      decisions.push({
        like,
        uri: track.uri,
        name: track.name,
        group: [artists.map((a) => a.name)].join(","),
        timestamp: Date.now(),
        artists_uri: artists.map((i) => i.uri),
        album_uri: album.uri,
      });
    }

    await client.json.set(
      `playlists:${id}`,
      `${playlistId}.decisions`,
      decisions,
    );

    await setMusic(client, album, artists, {
      ...track,
      artists_uri: artists.map((i) => i.uri),
      album_uri: album.uri,
    });

    res.send({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteDecision = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { playlistId, index } = req.query;
    //await using redisClient = await createRedisClient(req);
    const redisClient = await createRedisClientManualDispose(req);
    const { client, id } = redisClient;

    let decisions;

    decisions = await client.json.get(`playlists:${id}`, {
      path: `${playlistId}.decisions`,
    });

    decisions.splice(index, 1);

    await client.json.set(
      `playlists:${id}`,
      `${playlistId}.decisions`,
      decisions,
    );
    res.status(200).send({ message: "200 OK" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
