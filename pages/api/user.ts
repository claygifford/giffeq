import type { NextApiRequest, NextApiResponse } from 'next';
import { Year, setCookie } from '../../lib/cookies/cookies';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  setCookie(res, 'name', 'lee', { maxAge: Year });

  res.status(200).json({ name: `${req.cookies['name']}` });
}