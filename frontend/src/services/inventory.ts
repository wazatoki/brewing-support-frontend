import { Inventory } from "@/models/inventory";
import { InventoryIngredient } from "@/models/inventoryIngredient";
import { BrewEvent } from "@/models/brewEvent";
import { RecieveEvent } from "@/models/recieveEvent";
import { consumedIngredientSum } from "@/services/brewEvent";
import { recievedIngredientSum } from "@/services/recieveEvent";

export function sortByDate(inventories: Inventory[]): Inventory[] {
  inventories.sort((item_a, item_b) => {
    if (item_a.onDate > item_b.onDate) {
      return 1;
    }
    return -1;
  });
  return inventories;
}

export const inventoryIngredientSum = (
  ingredientID: string,
  inventories = [] as Inventory[]
) => {
  const buffer = [] as InventoryIngredient[];
  inventories.forEach((item) => {
    const filteredInventoryIngredients = item.ingredients.filter(
      (inventoryIngredient) =>
        inventoryIngredient.ingredient.id === ingredientID
    );
    filteredInventoryIngredients.forEach((item) => buffer.push(item));
  });

  const result = buffer.reduce(
    (acc, elem) => Number(acc) + Number(elem.adjustedValue),
    0
  );
  if (buffer.length === 0) {
    return 0;
  }

  return buffer[0].convertAdjustedValueToBaseUnit.quantity;
};

export const inventoryCalculatedValue = (
  ingredientID: string,
  inventories: Inventory[],
  brewEvents: BrewEvent[],
  recieveEvents: RecieveEvent[]
) => {
  return (
    inventoryIngredientSum(ingredientID, inventories) +
    recievedIngredientSum(ingredientID, recieveEvents) -
    consumedIngredientSum(ingredientID, brewEvents)
  );
};
