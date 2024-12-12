export abstract class BaseConverter {
  abstract convert(value: number, from: string, to: string): number;

  isValidUnit(unit: string): boolean {
    if (this.getUnitType() === 'Distance') {
      return ['meter', 'centimeter', 'inch', 'feet', 'yard'].includes(unit);
    } else if (this.getUnitType() === 'Temperature') {
      return ['C', 'F', 'K'].includes(unit);
    } else {
      throw new Error(`Unsupported unitType: ${this.getUnitType()}`);
    }
  }

  abstract getUnitType(): string;
}
