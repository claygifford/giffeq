import { createClient } from "redis";
import { Album, Artist, Song, Track } from "../../lib/types/song";

export const setMusic = async (
  client: ReturnType<typeof createClient>,
  album: Album,
  artists: Artist[],
  track: Track,
) => {
  await setAlbum(client, album);
  await setArtists(client, artists);
  await setTrack(client, track);
};

export const setAlbum = async (
  client: ReturnType<typeof createClient>,
  album,
) => {
  const exists = await client.exists(`${album.uri}`);
  if (exists) return;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let { artists, available_markets, ...rest } = album;
  rest.artists = [];
  artists.forEach((artist) => {
    rest.artists.push(artist.uri);
  });
  await client.json.set(`${album.uri}`, `.`, rest);
};

export const setArtists = (
  client: ReturnType<typeof createClient>,
  artists,
) => {
  artists.forEach(async (artist) => {
    const exists = await client.exists(`${artist.uri}`);
    if (!exists) await client.json.set(`${artist.uri}`, `.`, artist);
  });
};

export const setTrack = async (
  client: ReturnType<typeof createClient>,
  track,
) => {
  const exists = await client.exists(`${track.uri}`);
  if (exists) return;
  await client.json.set(`${track.uri}`, `.`, track);
};

export const getAlbums = async (
  client: ReturnType<typeof createClient>,
  uris,
) => {
  // const exists = await client.exists(`albums:${uri}`);
  // if (exists)
  //`albums:${uri}`
  return (await client.json.mGet(uris, ".")) as Album[];
};

export const getArtists = async (
  client: ReturnType<typeof createClient>,
  uris,
) => {
  // artists.forEach(async (artist) => {
  //   const exists = await client.exists(`artists:${artist.uri}`);
  //   if (!exists) await client.json.set(`artists:${artist.uri}`, `.`, artist);
  // });
  //`artists:${track.uri}`
  return (await client.json.mGet(uris, ".")) as Artist[];
};

export const getTracks = async (
  client: ReturnType<typeof createClient>,
  uris: string[],
) => {
  // const exists = await client.exists(`track:${uri}`);
  // if (exists) return await client.json.mget(`albums:${uri}`);

  // const exists = await client.exists(`track:${track.uri}`);
  // if (exists) return;
  // await client.json.set(`track:${track.uri}`, `.`, track);
  //`track:${track.uri}`
  return (await client.json.mGet(uris, ".")) as Song[];
};
