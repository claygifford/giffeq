import { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";
import { serialize, CookieSerializeOptions } from "cookie";
import { createApiClient } from "../../../lib/clients/api";
import { createRedisClient } from "../../../lib/clients/redis";
import { Connector } from "../../../lib/types/playlist";
import { getTimestamp } from "../../../lib/clients/spotify";

const Env = {
  CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const { method } = req;

  if (method === "GET" && query === "login") {
    return login(res);
  } else if (method === "GET" && query === "callback") {
    return callback(req, res);
  } else if (method === "GET" && query === "refresh_token") {
    return refreshToken(req, res);
  } else if (method === "PUT" && query === "play") {
    return play(req, res);
  }

  res.end(`Query: ${query} Method: ${method}`);
}

var stateKey = "spotify_auth_state";

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {},
) => {
  const stringValue =
    typeof value === "object" ? JSON.stringify(value) : String(value);

  if (typeof options.maxAge === "number") {
    options.expires = new Date(Date.now() + options.maxAge * 1000);
  }

  res.setHeader("Set-Cookie", serialize(name, stringValue, options));
};

const clearCookie = (res: NextApiResponse, name: string) => {
  res.setHeader("Set-Cookie", serialize(name, "", { maxAge: -1 }));
};

const login = (res: NextApiResponse) => {
  var state = generateRandomString(16);
  //res.cookie(stateKey, state);
  setCookie(res, stateKey, state, { path: "/", maxAge: 2592000 });

  // your application requests authorization
  //user-read-currently-playing and/or user-read-playback-state
  var scope =
    "streaming user-read-private user-read-email user-read-currently-playing user-read-playback-state";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: Env.CLIENT_ID,
        scope: scope,
        redirect_uri: Env.REDIRECT_URI,
        state: state,
      }),
  );
};

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    let output = "";
    if (state === null) {
      output += "state is null";
    }
    if (storedState === null) {
      output += "storedState is null";
    }
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch_" + output,
        }),
    );
  } else {
    clearCookie(res, stateKey);

    const apiClient = createApiClient();
    try {
      const auth_token = Buffer.from(
        `${Env.CLIENT_ID}:${Env.CLIENT_SECRET}`,
        "utf-8",
      ).toString("base64");

      const response = await apiClient.post<{
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        scope: string;
        refresh_date: number;
      }>(
        "https://accounts.spotify.com/api/token",
        {
          Authorization: `Basic ${auth_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        new URLSearchParams({
          code: code as string,
          grant_type: "authorization_code",
          redirect_uri: Env.REDIRECT_URI,
        }),
      );
      await using redisClient = await createRedisClient(req);
      const { client, id } = redisClient;

      let connectors: { [key: string]: Connector };
      try {
        connectors = (await client.json.get(`user:${id}`, {
          path: `connectors`,
        })) as { [key: string]: Connector };
      } catch {
        connectors = {} as { [key: string]: Connector };
      }

      response.refresh_date = getTimestamp(response.expires_in);
      connectors["spotify"] = response;
      await client.json.set(`user:${id}`, `connectors`, connectors);
      res.redirect("/");
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
};

const refreshToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const { refresh_token } = req.query;

  const apiClient = createApiClient();
  try {
    const auth_token = Buffer.from(
      `${Env.CLIENT_ID}:${Env.CLIENT_SECRET}`,
      "utf-8",
    ).toString("base64");

    const response = await apiClient.post<{
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
      refresh_date: number;
    }>(
      "https://accounts.spotify.com/api/token",
      {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      new URLSearchParams({
        refresh_token: refresh_token as string,
        grant_type: "refresh_token",
        client_id: Env.CLIENT_ID,
      }),
    );
    await using redisClient = await createRedisClient(req);
    const { client, id } = redisClient;

    let connectors: { [key: string]: Connector };
    try {
      connectors = (await client.json.get(`user:${id}`, {
        path: `connectors`,
      })) as { [key: string]: Connector };
    } catch {
      connectors = {} as { [key: string]: Connector };
    }

    connectors["spotify"] = {
      ...connectors["spotify"],
      ...{
        access_token: response.access_token,
        refresh_date: getTimestamp(response.expires_in),
      },
    };
    await client.json.set(`user:${id}`, `connectors`, connectors);
    res.send(connectors["spotify"]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const play = async (req: NextApiRequest, res: NextApiResponse) => {
  const { device_id } = req.query;
  const { uris } = req.body;
  console.log(`play ${device_id} ${uris}`);
  await using redisClient = await createRedisClient(req);
  const { client, id } = redisClient;

  const connectors = await client.json.get(`user:${id}`, {
    path: `connectors`,
  });

  const access_token = connectors["spotify"].access_token;

  try {
    const apiClient = createApiClient();
    await apiClient.put(
      "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
      {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      { uris },
    );

    res.send({});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
