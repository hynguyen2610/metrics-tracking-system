import { Metric } from '@/app/models/interfaces';

interface ChartTableProps {
    metrics: Metric[];
  }
  
  const ChartTable: React.FC<ChartTableProps> = ({ metrics: metrics }) => {
    if (metrics.length === 0) {
      return <p>No chart data available for the selected date range.</p>;
    }
  
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Value</th>
            <th scope="col">Unit</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => (
            <tr key={index}>
              <td>{new Date(metric.date).toDateString()}</td>
              <td>{metric.value}</td>
              <td>{metric.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default ChartTable;