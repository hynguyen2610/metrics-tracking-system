import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { convertMetrics } from '@/app/utils/converter/convert-util';

export async function GET(request: Request) {
    const { unitType, fromDate, toDate, convertToUnit } = Object.fromEntries(new URL(request.url).searchParams);

    try {
        // Validate unitType
        if (!unitType || (unitType !== 'Distance' && unitType !== 'Temperature')) {
            return NextResponse.json({ error: 'Invalid unit type' }, { status: 400 });
        }

        // Validate fromDate and toDate
        if (!fromDate || !toDate) {
            return NextResponse.json({ error: 'Both fromDate and toDate are required' }, { status: 400 });
        }

        // Parse dates to check validity
        const parsedFromDate = new Date(fromDate);
        const parsedToDate = new Date(toDate);

        // Ensure fromDate and toDate are valid
        if (isNaN(parsedFromDate.getTime()) || isNaN(parsedToDate.getTime())) {
            return NextResponse.json({ error: 'Invalid date format for fromDate or toDate' }, { status: 400 });
        }

        // SQL query to get the aggregated data (daily, hourly, etc.)
        const res = await query(`
            WITH ranked_metrics AS (
            SELECT
                m.date,
                m.value,
                u.name AS unit_name,
                u.unit,
                ROW_NUMBER() OVER (PARTITION BY DATE(m.date) ORDER BY m.date DESC) AS rn
            FROM metrics m
            JOIN units u ON m.unit_id = u.id
            WHERE u.unit_type = $1
                AND m.date >= $2
                AND m.date <= $3
            )
            SELECT
            date as date,
            value,
            unit_name,
            unit
            FROM ranked_metrics
            WHERE rn = 1
            ORDER BY date DESC;

        `, [unitType, parsedFromDate.toISOString(), parsedToDate.toISOString()]);

        const metrics = res.rows;

        if (!metrics || metrics.length === 0) {
            return NextResponse.json({ message: 'No metrics found for the given date range' }, { status: 404 });
        }

        let chartData = metrics;

        // Handle unit conversion if convertToUnit is provided
        if (convertToUnit) {
            chartData = await convertMetrics(metrics, unitType, convertToUnit);
        }

        // Return the chart data
        return NextResponse.json(chartData);

    } catch (error) {
        console.error('Error fetching chart data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}