import { Metric } from '@/app/models/interfaces';
import { convertMetrics } from '@/app/utils/converter/convert-util';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
      const url = new URL(request.url);
      const unitType = url.searchParams.get("unitType");
      const convertToUnit = url.searchParams.get("convertToUnit");
      const username = url.searchParams.get("username");
  
      if (!unitType) {
        return NextResponse.json({ error: "unitType is required" }, { status: 400 });
      }
  
      // Construct the SQL query
      let sqlQuery = `
        SELECT m.id, m.value, m.date, u.name AS unit_name, u.unit_type, u.unit, us.full_name, m.username
        FROM metrics m
        JOIN units u ON m.unit_id = u.id
        LEFT JOIN users us ON m.username = us.username
        WHERE u.unit_type = $1
      `;
  
      // Add filter for username if provided
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryParams: any[] = [unitType];
      if (username) {
        sqlQuery += " AND m.username = $2";
        queryParams.push(username);
      }
  
      sqlQuery += " ORDER BY m.date DESC";
  
      // Execute the query
      const res = await query(sqlQuery, queryParams);
  
      // If no rows returned
      if (res.rows.length === 0) {
        return NextResponse.json({ error: `No metrics found for unit type: ${unitType}` }, { status: 404 });
      }
  
      // Convert raw database rows to Metric objects
      const metrics: Metric[] = res.rows.map((row) => ({
        id: row.id,
        value: row.value,
        date: row.date,
        unitName: row.unit_name,
        unitType: row.unit_type,
        unit: row.unit,
        fullName: row.full_name,
        username: row.username
      }));
  
      // If a conversion is requested, apply it to each metric
      if (convertToUnit) {
        const convertedMetrics = await convertMetrics(metrics, unitType, convertToUnit);
        return NextResponse.json(convertedMetrics);
      }
  
      // Return the metrics along with the user's full name in the response
      return NextResponse.json(metrics);
    } catch (error) {
      console.error("Error fetching or converting metrics:", error);
      return NextResponse.json({ error: "Error fetching or converting metrics" }, { status: 500 });
    }
  }