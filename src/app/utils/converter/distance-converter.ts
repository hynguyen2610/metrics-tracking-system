import * as math from 'mathjs';
import { BaseConverter } from './base-converter';

export class DistanceConverter extends BaseConverter {
  getUnitType(): string {
    return 'Distance';
  }
  private static instance: DistanceConverter;

  private conversionTable: Record<string, Record<string, number>> = {
    meter: {
      meter: 1,
      centimeter: 100,
      inch: 39.3701,
      feet: 3.28084,
      yard: 1.09361,
    },
    centimeter: {
      meter: 0.01,
      centimeter: 1,
      inch: 0.393701,
      feet: 0.0328084,
      yard: 0.0109361,
    },
    inch: {
      meter: 0.0254,
      centimeter: 2.54,
      inch: 1,
      feet: 0.0833333,
      yard: 0.0277778,
    },
    feet: {
      meter: 0.3048,
      centimeter: 30.48,
      inch: 12,
      feet: 1,
      yard: 0.333333,
    },
    yard: { meter: 0.9144, centimeter: 91.44, inch: 36, feet: 3, yard: 1 },
  };

  private constructor() {
    super();
  }

  // Static method to get the instance of the converter
  public static getInstance(): DistanceConverter {
    if (!DistanceConverter.instance) {
      DistanceConverter.instance = new DistanceConverter();
    }
    return DistanceConverter.instance;
  }

  convert(value: number, from: string, to: string): number {
    // Validate the units
    if (!this.isValidUnit(from) || !this.isValidUnit(to)) {
      throw new Error(`Invalid unit type: ${from} or ${to}`);
    }

    // Handle the case where the units are the same
    if (from === to) {
      return value;
    }

    // Get the conversion rate from the table
    const rate = this.conversionTable[from]?.[to];

    if (!rate) {
      throw new Error(`Cannot convert from ${from} to ${to}`);
    }

    // Use mathjs for the conversion
    return math.multiply(value, rate);
  }
}
