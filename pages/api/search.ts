import { NextApiRequest, NextApiResponse } from "next";
import { createRedisClient } from "../../lib/clients/redis";
import { HttpMethods, hasToken } from "./methods";
import { createApiClient } from "../../lib/clients/api";
import { getSpotifyAccessToken } from "../../lib/clients/spotify";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasToken(req, res)) return;
  if (req.method === HttpMethods.get) return getSearch(req, res);
  return res.status(405).send({ message: "405 Method Not Allowed" });
}

const getSearch = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { q, type } = req.query;
    const apiClient = createApiClient();
    await using redisClient = await createRedisClient(req);
    const { client, id } = redisClient;

    const { spotifyAccessToken } = await getSpotifyAccessToken(client, id);
    const response = await apiClient.get<any>(
      `https://api.spotify.com/v1/search?q=${q}&type=${type}`,
      {
        Authorization: "Bearer " + spotifyAccessToken,
        "Content-Type": "application/json",
      },
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
