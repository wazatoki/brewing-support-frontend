import { Ingredient } from "@/models/ingredient";
import { createUUID } from "@/services/utils";

export class InventoryIngredient {
  id: string;
  ingredient: Ingredient;
  resultValue: number;
  calculatedValue: number;
  adjustedValue: number;
  note: string;

  constructor(
    id = "",
    ingredient: Ingredient,
    resultValue = 0,
    calculatedValue = 0,
    adjustedValue = 0,
    note = ""
  ) {
    this.id = id || "inventory_ingredient-" + createUUID();
    this.ingredient = ingredient;
    this.resultValue = resultValue;
    this.calculatedValue = calculatedValue;
    this.adjustedValue = adjustedValue;
    this.note = note;
  }
}
