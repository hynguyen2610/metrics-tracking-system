import { DistanceConverter } from '../distance-converter'; // Adjust the import path if necessary

describe('DistanceConverter', () => {
  const converter: DistanceConverter = DistanceConverter.getInstance();

  it('should return correct conversion for valid units', () => {
    const result = converter.convert(100, 'meter', 'feet');
    expect(result).toBeCloseTo(328.084, 3); // 100 * 3.28084 = 328.084
  });

  it('should throw an error for invalid units', () => {
    // Check that the error message matches using toThrow with a string or a regular expression
    expect(() => converter.convert(100, 'unknown', 'meter')).toThrow(
      'Invalid unit type: unknown or meter'
    );
    expect(() => converter.convert(100, 'meter', 'unknown')).toThrow(
      'Invalid unit type: meter or unknown'
    );
  });

  it('should throw an error if conversion rate is not available', () => {
    expect(() => converter.convert(100, 'meter', 'kilometer')).toThrow(
      'Invalid unit type: meter or kilometer'
    );
  });

  it('should handle unit to itself (no conversion)', () => {
    const result = converter.convert(100, 'meter', 'meter');
    expect(result).toBe(100); // Should not change the value
  });

  it('should use singleton pattern', () => {
    const instance1 = DistanceConverter.getInstance();
    const instance2 = DistanceConverter.getInstance();

    expect(instance1).toBe(instance2); // Both instances should be the same
  });

  it('should handle all valid distance conversions correctly', () => {
    const conversionTestCases = [
      { from: 'meter', to: 'centimeter', value: 1, expected: 100 },
      { from: 'meter', to: 'inch', value: 1, expected: 39.3701 },
      { from: 'meter', to: 'feet', value: 1, expected: 3.28084 },
      { from: 'meter', to: 'yard', value: 1, expected: 1.09361 },
      { from: 'centimeter', to: 'meter', value: 100, expected: 1 },
      { from: 'centimeter', to: 'inch', value: 2.54, expected: 1 },
      { from: 'centimeter', to: 'feet', value: 30.48, expected: 1 },
      { from: 'centimeter', to: 'yard', value: 91.44, expected: 1 },
      { from: 'inch', to: 'meter', value: 39.3701, expected: 1 },
      { from: 'inch', to: 'centimeter', value: 1, expected: 2.54 },
      { from: 'inch', to: 'feet', value: 12, expected: 1 },
      { from: 'inch', to: 'yard', value: 36, expected: 1 },
      { from: 'feet', to: 'meter', value: 3.28084, expected: 1 },
      { from: 'feet', to: 'centimeter', value: 1, expected: 30.48 },
      { from: 'feet', to: 'inch', value: 1, expected: 12 },
      { from: 'feet', to: 'yard', value: 3, expected: 1 },
      { from: 'yard', to: 'meter', value: 1, expected: 0.9144 },
      { from: 'yard', to: 'centimeter', value: 1, expected: 91.44 },
      { from: 'yard', to: 'inch', value: 1, expected: 36 },
      { from: 'yard', to: 'feet', value: 1, expected: 3 },
    ];

    conversionTestCases.forEach(({ from, to, value, expected }) => {
      const result = converter.convert(value, from, to);
      expect(result).toBeCloseTo(expected, 3); // Use toBeCloseTo for floating-point comparisons
    });
  });
});
