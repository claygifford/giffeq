import type { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from '../../lib/cookies/cookies';
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '../../src/aws-exports';

Amplify.configure(awsExports);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: '405 Method Not Allowed' });
    return;
  }

  try {
    const user = await Auth.currentAuthenticatedUser();
    setCookie(res, 'user', `${user.username}`);
    res.status(200).json({ refresh: true, user: user });    
  } catch (e) {
    res.status(200).json({ refresh: false });
  }
}
