import { TemperatureConverter } from '../temperature-converter'; // Adjust the path if necessary

describe('TemperatureConverter', () => {
  const converter: TemperatureConverter = TemperatureConverter.getInstance();

  it('should return correct conversion for valid units (C to F)', () => {
    const result = converter.convert(100, 'C', 'F');
    expect(result).toBeCloseTo(212, 5); // (100 * 9/5) + 32 = 212
  });

  it('should return correct conversion for valid units (F to C)', () => {
    const result = converter.convert(100, 'F', 'C');
    expect(result).toBeCloseTo(37.77777777777778, 5); // (100 - 32) * 5/9 = 37.77777777777778
  });

  it('should return correct conversion for valid units (C to K)', () => {
    const result = converter.convert(100, 'C', 'K');
    expect(result).toBeCloseTo(373.15, 2); // 100 + 273.15 = 373.15
  });

  it('should return correct conversion for valid units (K to C)', () => {
    const result = converter.convert(273.15, 'K', 'C');
    expect(result).toBeCloseTo(0, 5); // 273.15 - 273.15 = 0
  });

  it('should throw an error for invalid units', () => {
    expect(() => converter.convert(100, 'unknown', 'C')).toThrow(
      'Invalid unit type: unknown or C'
    );
    expect(() => converter.convert(100, 'C', 'unknown')).toThrow(
      'Invalid unit type: C or unknown'
    );
  });

  it('should throw an error if conversion rate is not available', () => {
    expect(() => converter.convert(100, 'C', 'Rankine')).toThrow(
      'Invalid unit type: C or Rankine'
    );
  });

  it('should handle unit to itself (no conversion)', () => {
    const result = converter.convert(100, 'C', 'C');
    expect(result).toBe(100); // Should not change the value
  });

  it('should use singleton pattern', () => {
    const instance1 = TemperatureConverter.getInstance();
    const instance2 = TemperatureConverter.getInstance();
    
    expect(instance1).toBe(instance2); // Both instances should be the same
  });

  it('should handle all valid temperature conversions correctly', () => {
    const conversionTestCases = [
      { from: 'C', to: 'F', value: 0, expected: 32 },
      { from: 'C', to: 'K', value: 0, expected: 273.15 },
      { from: 'F', to: 'C', value: 32, expected: 0 },
      { from: 'F', to: 'K', value: 32, expected: 273.15 },
      { from: 'K', to: 'C', value: 273.15, expected: 0 },
      { from: 'K', to: 'F', value: 273.15, expected: 32 },
    ];

    conversionTestCases.forEach(({ from, to, value, expected }) => {
      const result = converter.convert(value, from, to);
      expect(result).toBeCloseTo(expected, 5);  // Use toBeCloseTo for floating-point comparisons
    });
  });
});
