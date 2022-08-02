import { Unit } from "./unit";

export class Ingredient {
  id: string;
  name: string;
  brewingUnit: Unit;
  recievingUnit: Unit;
  stockingUnit: Unit;

  constructor(
    id = "",
    name = "",
    brewingUnit: Unit,
    recievingUnit: Unit,
    stockingUnit: Unit
  ) {
    this.id = id;
    this.name = name;
    this.brewingUnit = brewingUnit;
    this.recievingUnit = recievingUnit;
    this.stockingUnit = stockingUnit;
  }

  clear() {
    this.id = "";
    this.name = "";
    this.brewingUnit = new Unit();
  }

  isReferenceUnit(unit: Unit) {
    if (this.brewingUnit && this.brewingUnit.id === unit.id) {
      return true;
    }
    return false;
  }
}

export interface IngredientMember {
  id: string;
  name: string;
  brewingUnit: Unit;
  recievingUnit: Unit;
  stockingUnit: Unit;
}
