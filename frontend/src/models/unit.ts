export class Unit implements UnitMenber {
  id: string;
  name: string;
  conversionFactor: number;
  baseUnit: Unit | null;

  clear() {
    this.id = "";
    this.name = "";
    this.conversionFactor = 0;
    this.baseUnit = null;
  }

  convertToBaseUnit(quantity: number): { quantity: number; baseUnit: Unit } {
    return {
      quantity: quantity * this.conversionFactor,
      baseUnit:
        this.baseUnit ||
        new Unit(this.id, this.name, this.conversionFactor, this.baseUnit),
    };
  }

  constructor(id = "", name = "", conversionFactor = 1, baseUnit = null) {
    this.id = id;
    this.name = name;
    this.conversionFactor = conversionFactor;
    this.baseUnit = baseUnit;
  }
}

export interface UnitMenber {
  id: string;
  name: string;
  conversionFactor: number;
  baseUnit: Unit | null;
}
