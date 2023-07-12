import type { NextApiRequest, NextApiResponse } from 'next';
import { clearCookie, setCookie } from '../../lib/cookies/cookies';
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

  await Auth.signOut();
  clearCookie(res, 'user');
  res.status(200).json({message: 'successful log out'});
}
