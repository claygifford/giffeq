import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';
import request from 'request';
import { serialize, CookieSerializeOptions } from 'cookie';

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
 res.setHeader('Set-Cookie', serialize(name, '', {maxAge: -1}));
}

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

const callback = (req: NextApiRequest, res: NextApiResponse) => {
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
    //res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: Env.REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(Env.CLIENT_ID + ':' + Env.CLIENT_SECRET).toString(
            'base64'
          ),
      },
      json: true,
    };
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });

        setCookie(
          res,
          'spotify_tokens',
          {
            access_token: access_token,
            refresh_token: refresh_token,
          },
          { path: '/', maxAge: 2592000 }
        );
        // we can also pass the token to the browser to make requests from there
        res.redirect(
          '/?' +
            querystring.stringify({
              spotify_activated: true,
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.redirect(
          '/#' +
            querystring.stringify({
              error: 'invalid_token',
            })
        );
      }
    });
  }
};