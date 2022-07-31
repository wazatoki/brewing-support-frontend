import { Unit } from "./unit";

export class Ingredient {
  id: string;
  name: string;
  brewingUnit: Unit;

  constructor(id = "", name = "", brewingUnit: Unit) {
    this.id = id;
    this.name = name;
    this.brewingUnit = brewingUnit;
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
}
