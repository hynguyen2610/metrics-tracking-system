// src/app/api/metrics/route.ts
import { query } from '../../../lib/db';

export async function GET() {
  try {
    // Query the metrics table to get all metrics with their type and unit
    const result = await query(`
      SELECT id, name, unit_type, unit
      FROM units
    `);

    // Extract rows from the result object
    const units = result.rows;

    // Return the result as JSON using new Response()
    return new Response(JSON.stringify(units), {
      status: 200, // HTTP status code
      headers: { 'Content-Type': 'application/json' }, // Set Content-Type header to application/json
    });
  } catch (error) {
    // Return an error response with status 500
    return new Response(
      JSON.stringify({ message: 'Failed to fetch metrics',  errorData: error }),
      {
        status: 500, // Internal server error status
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
