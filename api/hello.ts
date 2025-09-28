import { VercelRequest, VercelResponse } from '@vercel/node';
import app from './index';
import { createServer } from 'http';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Adapta o Express para Vercel
  app(req, res);
}
