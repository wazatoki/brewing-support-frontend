export class Unit {
  id: string;
  name: string;
  conversionFactor: number;
  baseUnit: Unit;

  convertToBaseUnit(quantity: number): { quantity: number; baseUnit: Unit } {
    return {
      quantity: quantity * this.conversionFactor,
      baseUnit: this.baseUnit,
    };
  }

  constructor(id = "", name = "", conversionFactor = 0, baseUnit: Unit) {
    this.id = id;
    this.name = name;
    this.conversionFactor = conversionFactor;
    this.baseUnit = baseUnit;
  }
}
