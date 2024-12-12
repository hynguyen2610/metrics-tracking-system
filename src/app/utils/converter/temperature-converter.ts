import * as math from 'mathjs';
import { BaseConverter } from './base-converter';

export class TemperatureConverter extends BaseConverter {
  getUnitType(): string {
    return "Temperature";
  }
  private static instance: TemperatureConverter;

  private constructor() {
    super();
  }

  public static getInstance(): TemperatureConverter {
    if (!TemperatureConverter.instance) {
      TemperatureConverter.instance = new TemperatureConverter();
    }
    return TemperatureConverter.instance;
  }

  convert(value: number, from: string, to: string): number {
    if (!this.isValidUnit(from) || !this.isValidUnit(to)) {
      throw new Error(`Invalid unit type: ${from} or ${to}`);
    }

    if (isNaN(value)) {
      throw new Error('The value to be converted is not a valid number');
    }

    if (from === to) {
      return value;
    }

    let celsius: number;

    if (from === 'C') {
      celsius = value;
    } else if (from === 'F') {
      celsius = math.multiply(math.subtract(value, 32), math.divide(5, 9));
    } else if (from === 'K') {
      celsius = math.subtract(value, 273.15);
    } else {
      throw new Error(`Unsupported source unit: ${from}`);
    }

    let result: number;
    if (to === 'C') {
      result = celsius;
    } else if (to === 'F') {
      result = math.add(math.multiply(celsius, 9 / 5), 32);
    } else if (to === 'K') {
      result = math.add(celsius, 273.15);
    } else {
      throw new Error(`Unsupported target unit: ${to}`);
    }

    return result;
  }
}

