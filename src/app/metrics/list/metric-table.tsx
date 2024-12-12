import React from 'react';
import { Metric } from '../../models/interfaces'; // Import the Metric interface to type the props

// Props Interface
interface MetricsTableProps {
  metrics: Metric[]; // List of metrics to display
}

// eslint-disable-next-line react/display-name
const MetricsTable: React.FC<MetricsTableProps> = React.memo(({ metrics }) => {
  console.log('Table metrics:', metrics);

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Value</th>
            <th>Unit</th>
            <th>Type</th>
            <th>Date</th>
            <th>Created by</th>
          </tr>
        </thead>
        <tbody>
          {metrics.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                No metrics found.
              </td>
            </tr>
          ) : (
            metrics.map((metric) => (
              <tr key={metric.id}>
                <td>{metric.id}</td>
                <td>{metric.value}</td>
                <td>{metric.unitName}</td>
                <td>{metric.unitType}</td>
                <td>{new Date(metric.date).toUTCString()}</td>
                <td>{metric.fullName}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});

export default MetricsTable;
