import { Ingredient } from "./ingredient";
import { Unit } from "./unit";
import { createUUID } from "@/services/utils";

export class RecievedIngredient {
  id: string;
  ingredient: Ingredient;
  quantity: number;

  convertToBaseUnit(): { quantity: number; baseUnit: Unit } {
    return this.ingredient.recievingUnit.convertToBaseUnit(this.quantity);
  }

  constructor(id = "", ingredient: Ingredient, quantity = 0) {
    this.id = id || "recieved_ingredient-" + createUUID();
    this.ingredient = ingredient;
    this.quantity = quantity;
  }
}
