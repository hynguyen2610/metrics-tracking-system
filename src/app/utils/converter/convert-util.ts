import { Metric } from '@/app/models/interfaces';
import { DistanceConverter } from './distance-converter';
import { TemperatureConverter } from './temperature-converter';

export async function convertMetrics(metrics: Metric[], unitType: string, convertToUnit: string): Promise<Metric[]> {
  const distanceConverter = DistanceConverter.getInstance();  // Use singleton instance
  const temperatureConverter = TemperatureConverter.getInstance();  // Use singleton instance

  return metrics.map((metric) => {
    const convertedMetric = { ...metric };

    if (unitType === 'Distance') {
      // Use DistanceConverter if unitType is 'Distance'
      convertedMetric.value = distanceConverter.convert(
        metric.value,
        metric.unit,
        convertToUnit
      );
      convertedMetric.unit = convertToUnit; // Set the new unit
      convertedMetric.unitName = convertToUnit; // Update the unitName
    } else if (unitType === 'Temperature') {
      // Use TemperatureConverter if unitType is 'Temperature'
      convertedMetric.value = temperatureConverter.convert(
        metric.value,
        metric.unit,
        convertToUnit
      );
      convertedMetric.unit = convertToUnit; // Set the new unit
      convertedMetric.unitName = convertToUnit; // Update the unitName
    } else {
      throw new Error(`Unsupported unitType: ${unitType}`);
    }

    return convertedMetric;
  });
}
