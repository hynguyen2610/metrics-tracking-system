/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'metrics',
  password: 'mypassword',
  port: 5432,
});

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};
