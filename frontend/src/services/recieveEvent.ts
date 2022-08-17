import { RecieveEvent } from "@/models/recieveEvent";
import { RecievedIngredient } from "@/models/recievedIngredient";

export function sortBySupplierNameAndRecieveDate(
  recieveEvents: RecieveEvent[]
): RecieveEvent[] {
  recieveEvents.sort((item_a, item_b) => {
    if (item_a.supplier && item_b.supplier) {
      if (item_a.supplier.name > item_b.supplier.name) {
        return 1;
      }
      if (item_a.supplier.name < item_b.supplier.name) {
        return -1;
      }
      if (item_a.recieveDate > item_b.recieveDate) {
        return 1;
      }
      return -1;
    }
    return 0;
  });

  return recieveEvents;
}

export const recievedIngredientSum = (
  ingredientID: string,
  recieveEvents: RecieveEvent[]
) => {
  const buffer = [] as RecievedIngredient[];
  recieveEvents.forEach((item) => {
    const filteredRecievedIngredients = item.ingredients.filter(
      (recievedIngredient) => recievedIngredient.ingredient.id === ingredientID
    );
    filteredRecievedIngredients.forEach((item) => buffer.push(item));
  });

  const result = buffer.reduce(
    (acc, elem) => Number(acc) + Number(elem.quantity),
    0
  );
  if (buffer.length === 0) {
    return 0;
  }

  return buffer[0].convertToBaseUnit.quantity;
};
