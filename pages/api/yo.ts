import { NextApiRequest, NextApiResponse } from 'next';
import { createRedisClient } from '../../lib/clients/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  if (!req.cookies['user']) {
    res.status(401).json({ message: req.cookies['user'] });
    return;
  }

  try {
    const client = await createRedisClient();
    let result = await client.get('testing');
    res.status(200).json({ name: `yo - endpoint 1 ${result}` });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
