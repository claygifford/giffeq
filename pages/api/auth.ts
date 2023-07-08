import type { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from '../../lib/cookies/cookies';
import { Auth } from 'aws-amplify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await Auth.currentAuthenticatedUser();
  setCookie(res, 'user', `${user.username}`);
  res.status(200).json({ name: `${req.cookies['user']}` });
}
