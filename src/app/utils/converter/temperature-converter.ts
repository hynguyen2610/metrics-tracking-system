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

  // Static method to get the instance of the converter
  public static getInstance(): TemperatureConverter {
    if (!TemperatureConverter.instance) {
      TemperatureConverter.instance = new TemperatureConverter();
    }
    return TemperatureConverter.instance;
  }

  convert(value: number, from: string, to: string): number {
    // Validate the units
    if (!this.isValidUnit(from) || !this.isValidUnit(to)) {
      throw new Error(`Invalid unit type: ${from} or ${to}`);
    }

    // Ensure value is a number (for safety in case of string input)
    if (isNaN(value)) {
      throw new Error('The value to be converted is not a valid number');
    }

    // Handle same units (no conversion needed)
    if (from === to) {
      return value;
    }

    // Convert the value from the source unit to Celsius first, then to the target unit
    let celsius: number;

    // Convert from source unit to Celsius
    if (from === 'C') {
      celsius = value;
    } else if (from === 'F') {
      celsius = math.multiply(math.subtract(value, 32), math.divide(5, 9));
    } else if (from === 'K') {
      celsius = math.subtract(value, 273.15); // Kelvin to Celsius
    } else {
      throw new Error(`Unsupported source unit: ${from}`);
    }

    // Convert from Celsius to target unit
    let result: number;
    if (to === 'C') {
      result = celsius;
    } else if (to === 'F') {
      result = math.add(math.multiply(celsius, 9 / 5), 32); // Celsius to Fahrenheit
    } else if (to === 'K') {
      result = math.add(celsius, 273.15); // Celsius to Kelvin
    } else {
      throw new Error(`Unsupported target unit: ${to}`);
    }

    return result;
  }
}
