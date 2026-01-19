/**
 * Express API Sample Project
 * Tests OpenAPI sync with Express routes
 */

import { Request, Response } from 'express';

/**
 * Get user by ID
 * GET /users/:id
 */
export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // SQL injection vulnerability for testing
    const query = `SELECT * FROM users WHERE id = ${id}`;
    const user = await db.query(query);

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Create new user
 * POST /users
 */
export async function createUser(req: Request, res: Response): Promise<void> {
  const { name, email } = req.body;

  // Missing input validation
  const user = await db.query(
    `INSERT INTO users (name, email) VALUES ('${name}', '${email}')`
  );

  res.status(201).json(user);
}

/**
 * Update user
 * PUT /users/:id
 */
export async function updateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name, email } = req.body;

  // Multiple SQL injection vulnerabilities
  const query = `UPDATE users SET name = '${name}', email = '${email}' WHERE id = ${id}`;
  await db.query(query);

  res.json({ message: 'User updated' });
}

/**
 * Delete user
 * DELETE /users/:id
 */
export async function deleteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  await db.query(`DELETE FROM users WHERE id = ${id}`);

  res.status(204).send();
}

// Mock database
const db = {
  query: async (sql: string) => {
    console.log('Executing query:', sql);
    return { id: 1, name: 'Test User', email: 'test@example.com' };
  },
};
