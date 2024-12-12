/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Metric } from '@/app/models/interfaces';

interface ChartProps {
  metrics: Metric[];
  selectedUnit: { name: string } | null; // Selected unit for conversion
}

const Chart: React.FC<ChartProps> = ({ metrics, selectedUnit }) => {
  const chartRef = useRef<HTMLDivElement | null>(null); // Reference to the chart container

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      // Prepare chart options
      const chartOptions = {
        title: {
          text: `Metrics Chart${selectedUnit ? ` (${selectedUnit.name})` : ''}`,
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            return `${params[0].name}: ${params[0].value} ${selectedUnit ? selectedUnit.name : ''}`;
          },
        },
        xAxis: {
          type: 'category',
          data: metrics.map((metric) => new Date(metric.date).toDateString()), // Time periods (x-axis)
          name: 'Time Period',
        },
        yAxis: {
          type: 'value',
          name: 'Metric Value',
        },
        series: [
          {
            data: metrics.map((metric) => metric.value), // Metric values (y-axis)
            type: 'line',
            smooth: true,
            areaStyle: {}, // Fill the area under the line
            itemStyle: {
              color: 'rgba(75, 192, 192, 1)', // Line color
            },
          },
        ],
      };

      // Set chart options
      chartInstance.setOption(chartOptions);

      // Dispose of the chart instance when the component unmounts
      return () => {
        chartInstance.dispose();
      };
    }
  }, [metrics, selectedUnit]); // Re-render chart when metrics or selectedUnit change

  return (
    <div className="chart-container" style={{ height: '400px' }} ref={chartRef}></div>
  );
};

export default Chart;
