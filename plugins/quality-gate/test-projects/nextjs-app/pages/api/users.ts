/**
 * Next.js App Sample Project
 * Tests Next.js API route scanning
 */

import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API Route: /api/users
 * Handles GET and POST requests
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;

  switch (method) {
    case 'GET':
      return getUsers(req, res);
    case 'POST':
      return createUser(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

/**
 * Get all users or user by ID
 */
async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (id) {
    // SQL injection vulnerability
    const user = await db.query(`SELECT * FROM users WHERE id = ${id}`);
    return res.json(user);
  }

  const users = await db.query('SELECT * FROM users LIMIT 100');
  return res.json(users);
}

/**
 * Create new user
 */
async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, password } = req.body;

  // Hardcoded secret and weak crypto
  const SECRET_KEY = 'my-secret-key-123';
  const hashedPassword = require('crypto').createHash('md5').update(password).digest('hex');

  // SQL injection
  const user = await db.query(
    `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`
  );

  return res.status(201).json(user);
}

// Mock database
const db = {
  query: async (sql: string) => {
    return [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' },
    ];
  },
};
