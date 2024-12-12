import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
      const { unit_id, value, date, username } = await req.json();
  
      // Validate input
      if (!unit_id || !value || !date || !username) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
      }
  
      const queryText = `
          INSERT INTO metrics (unit_id, value, date, username)
          VALUES ($1, $2, $3, $4)
          RETURNING id`;
  
      // Assuming the 'user' is the user name from a session or authentication system
      const { rows } = await query(queryText, [unit_id, value, date, username]);
  
      return NextResponse.json({ id: rows[0].id });
    } catch (err) {
      console.error('Error adding metric:', err);
      return NextResponse.json({ error: 'Failed to add metric' }, { status: 500 });
    }
  }