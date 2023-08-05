import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';

export const HttpMethods = {
  delete: 'DELETE',
  get: 'GET',
  post: 'POST',
  put: 'PUT',
};

export const generateToken = () => {
    return nanoid();
};

export const hasToken = (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.cookies['token']) {
    res.status(401).json({ message: '401 Unauthorized' });
    return false;
  }

  return true;
};