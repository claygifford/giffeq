import type { NextApiResponse } from 'next';
import { serialize, CookieSerializeOptions } from 'cookie';

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  if (typeof options.maxAge === 'number') {
    options.expires = new Date(Date.now() + options.maxAge * 1000);
  }

  options.httpOnly = true;
  options.secure = true;

  res.setHeader('Set-Cookie', serialize(name, stringValue, options));
};

export const clearCookie = (
  res: NextApiResponse,
  name: string,
  options: CookieSerializeOptions = {}
) => {

  options.expires = new Date(null);
  options.httpOnly = true;
  options.secure = true;

  res.setHeader('Set-Cookie', serialize(name, '', options));
};