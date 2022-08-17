import { BrewEvent } from "@/models/brewEvent";
import { ConsumedIngredient } from "@/models/consumedIngredient";

export const consumedIngredientSum = (
  ingredientID: string,
  brewEvents = [] as BrewEvent[]
) => {
  const buffer = [] as ConsumedIngredient[];
  brewEvents.forEach((item) => {
    const filteredConsumedIngredients = item.ingredients.filter(
      (consumedIngredient) => consumedIngredient.ingredient.id === ingredientID
    );
    filteredConsumedIngredients.forEach((item) => buffer.push(item));
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
