import { Ingredient } from "./ingredient";
import { Unit } from "./unit";
import { createUUID } from "@/services/utils";

export class ConsumedIngredient {
  id: string;
  ingredient: Ingredient;
  quantity: number;

  convertToBaseUnit(): { quantity: number; baseUnit: Unit } {
    return this.ingredient.brewingUnit.convertToBaseUnit(this.quantity);
  }

  constructor(id = "", ingredient: Ingredient, quantity = 0) {
    this.id = id || "consumed_ingredient-" + createUUID();
    this.ingredient = ingredient;
    this.quantity = quantity;
  }
}
