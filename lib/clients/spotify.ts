import { Env } from "../server/env";
import { Connector } from "../types/playlist";
import { createApiClient } from "./api";

export const getSpotifyAccessToken = async (client, id) => {
  let connectors: { [key: string]: Connector };
  try {
    connectors = (await client.json.get(`user:${id}`, {
      path: `connectors`,
    })) as { [key: string]: Connector };
  } catch {
    connectors = {} as { [key: string]: Connector };
  }

  const spotify = connectors["spotify"];
  if (!spotify) {
    throw "no spotify connector found";
  }

  if (!spotify.refresh_date || spotify.refresh_date < Date.now()) {
    const auth_token = Buffer.from(
      `${Env.CLIENT_ID}:${Env.CLIENT_SECRET}`,
      "utf-8",
    ).toString("base64");

    const response = await createApiClient().post<{
      access_token: string;
      token_type: string;
      expires_in: number;
      scope: string;
    }>(
      "https://accounts.spotify.com/api/token",
      {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: spotify.refresh_token,
      }),
    );

    const refresh_date = getTimestamp(response.expires_in);

    connectors["spotify"] = {
      ...connectors["spotify"],
      ...{
        access_token: response.access_token,
        refresh_date,
      },
    };
    await client.json.set(`user:${id}`, `connectors`, connectors);
  }

  return { spotifyAccessToken: connectors["spotify"].access_token };
};

export const tokenIsFresh = (connector: Connector) => {
  const value = connector.refresh_date > getTimestamp(0);
  console.log(
    `tokenIsFresh: ${value} | ${new Date(connector.refresh_date).toLocaleTimeString()} --- ${new Date(
      getTimestamp(0),
    ).toLocaleTimeString()}`,
  );
  return value;
};

export const getTimestamp = (seconds) => {
  let date = new Date();
  if (seconds) date.setSeconds(date.getSeconds() + seconds);
  return date.getTime();
};

export const getMilliseconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (+seconds < 10 ? "0" : "") + seconds;
};
