import type { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from '../../lib/cookies/cookies';
import { Auth } from 'aws-amplify';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: '405 Method Not Allowed' });
    return;
  }

  try {
    const { username, password } = req.body;

    const user = await Auth.signIn(username, password);

    setCookie(res, 'user', `${user.username}`);
    res.status(200).json({ username: user.username});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
