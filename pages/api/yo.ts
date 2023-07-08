import { createRedisClient } from '../../lib/clients/redis';

export default async function handler(req, res) {
  if (!req.cookies['user']) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const client = await createRedisClient();
    let result = await client.get('testing');
    res.status(200).json({ name: `yo - endpoint ${result}` });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
