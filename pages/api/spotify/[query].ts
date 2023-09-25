import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';
import { serialize, CookieSerializeOptions } from 'cookie';
import { createApiClient } from '../../../lib/clients/api';
import { createRedisClient } from '../../../lib/clients/redis';
import { Connector } from '../../../lib/types/playlist';

const Env = {
  CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(
    `testing ${process.env.NEXT_PUBLIC_TESTINGENV} ${process.env.SPOTIFY_REDIRECT_URI} ${Env.REDIRECT_URI}`
  );

  const { query } = req.query;
  const { method } = req;
  if (method === 'GET' && query === 'login') {
    return login(res);
  } else if (method === 'GET' && query === 'callback') {
    return callback(req, res);
  } else if (method === 'GET' && query === 'refresh_token') {
    return refreshToken(req, res);
  }

  res.end(`Query: ${query} Method: ${method}`);
}

var stateKey = 'spotify_auth_state';

var generateRandomString = function (length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === 'object' ? JSON.stringify(value) : String(value);

  if (typeof options.maxAge === 'number') {
    options.expires = new Date(Date.now() + options.maxAge * 1000);
  }

  res.setHeader('Set-Cookie', serialize(name, stringValue, options));
};

const clearCookie = (res: NextApiResponse, name: string) => {
  res.setHeader('Set-Cookie', serialize(name, '', { maxAge: -1 }));
};

const login = (res: NextApiResponse) => {
  var state = generateRandomString(16);
  //res.cookie(stateKey, state);
  setCookie(res, stateKey, state, { path: '/', maxAge: 2592000 });

  // your application requests authorization
  //user-read-currently-playing and/or user-read-playback-state
  var scope =
    'user-read-private user-read-email user-read-currently-playing user-read-playback-state';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: Env.CLIENT_ID,
        scope: scope,
        redirect_uri: Env.REDIRECT_URI,
        state: state,
      })
  );
};

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    let output = '';
    if (state === null) {
      output += 'state is null';
    }
    if (storedState === null) {
      output += 'storedState is null';
    }
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch_' + output,
        })
    );
  } else {
    clearCookie(res, stateKey);

    const form = new FormData();
    form.append('code', code as string);
    form.append('redirect_uri', Env.REDIRECT_URI);
    form.append('grant_type', 'authorization_code');

    const apiClient = createApiClient();
    try {

      const auth_token = Buffer.from(
        `${Env.CLIENT_ID}:${Env.CLIENT_SECRET}`,
        'utf-8'
      ).toString('base64');

      const response = await apiClient.post<{
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        scope: string;
        refresh_date: number;
      }>(
        'https://accounts.spotify.com/api/token',
        {
          Authorization: `Basic ${auth_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        new URLSearchParams({
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: Env.REDIRECT_URI,
        })
      );
      const { client, id } = await createRedisClient(req);

      let connectors: {[key: string]: Connector};
      try {
        connectors = (await client.json.get(`user:${id}`, {
          path: `connectors`,
        })) as { [key: string]: Connector };
      } catch {
        connectors = {} as { [key: string]: Connector };
      }

      connectors['spotify'] = response;
      await client.json.set(`user:${id}`, `connectors`, connectors); 

      res.redirect('/');
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
};

const refreshToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const { refresh_token } = req.query;

  // var authOptions = {
  //   url: 'https://accounts.spotify.com/api/token',
  //   form: {
  //     grant_type: 'refresh_token',
  //     refresh_token: refresh_token,
  //   },
  //   headers: {
  //     Authorization:
  //       'Basic ' +
  //       new Buffer(Env.CLIENT_ID + ':' + Env.CLIENT_SECRET).toString('base64'),
  //   },
  //   json: true,
  // };

  const form = new FormData();
  form.append('grant_type', 'refresh_token');
  form.append('refresh_token', refresh_token as string);

  const headers = {
    Authorization:
      'Basic ' +
      new Buffer(Env.CLIENT_ID + ':' + Env.CLIENT_SECRET).toString('base64'),
    'content-type': 'application/json',
  };

  console.log('over here!@#');

  const client = createApiClient();
  try {
    await client.post('https://accounts.spotify.com/api/token', headers, form);
    console.log('wow got all the way here');
    res.status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }

  // request.post(authOptions, function (error, response, body) {
  //   if (!error && response.statusCode === 200) {
  //     var access_token = body.access_token;
  //     res.send({
  //       'access_token': access_token,
  //     });
  //   }
  // });
};
