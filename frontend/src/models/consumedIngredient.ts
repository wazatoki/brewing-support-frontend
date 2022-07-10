import { Ingredient } from "./ingredient";
import { Unit } from "./unit";

export class ConsumedIngredient {
  id: string;
  ingredient: Ingredient;
  quantity: number;

  convertToBaseUnit(): { quantity: number; baseUnit: Unit } {
    return this.ingredient.brewingUnit.convertToBaseUnit(this.quantity);
  }

  constructor(id = "", ingredient: Ingredient, quantity = 0) {
    this.id = id;
    this.ingredient = ingredient;
    this.quantity = quantity;
  }
}
