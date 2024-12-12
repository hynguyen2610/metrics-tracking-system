import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      // Query to fetch all users
      const result = await query('SELECT * FROM users');
  
      // Return the rows as JSON
      return NextResponse.json(result.rows);
    } catch (error) {
      console.error("Error fetching users:", error);
      return NextResponse.error();
    }
  }