import { Ingredient } from "@/models/ingredient";
import { Unit } from "@/models/unit";

export function unitReferencingList(
  targetIngredients: Ingredient[],
  unit: Unit
): Ingredient[] {
  const ingredients: Ingredient[] = [];

  targetIngredients.forEach((item: Ingredient) => {
    if (item.isReferenceUnit(unit)) {
      ingredients.push(item);
    }
  });

  return ingredients;
}
