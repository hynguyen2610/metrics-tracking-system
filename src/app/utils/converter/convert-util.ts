import { Metric } from '@/app/models/interfaces';
import { DistanceConverter } from './distance-converter';
import { TemperatureConverter } from './temperature-converter';

export async function convertMetrics(metrics: Metric[], unitType: string, convertToUnit: string): Promise<Metric[]> {
  const distanceConverter = DistanceConverter.getInstance();
  const temperatureConverter = TemperatureConverter.getInstance();

  return metrics.map((metric) => {
    const convertedMetric = { ...metric };

    if (unitType === 'Distance') {
      convertedMetric.value = distanceConverter.convert(
        metric.value,
        metric.unit,
        convertToUnit
      );
      convertedMetric.unit = convertToUnit;
      convertedMetric.unitName = convertToUnit;
    } else if (unitType === 'Temperature') {
      convertedMetric.value = temperatureConverter.convert(
        metric.value,
        metric.unit,
        convertToUnit
      );
      convertedMetric.unit = convertToUnit;
      convertedMetric.unitName = convertToUnit;
    } else {
      throw new Error(`Unsupported unitType: ${unitType}`);
    }

    return convertedMetric;
  });
}

