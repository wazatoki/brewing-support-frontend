import { Ingredient } from "@/models/ingredient";
import { IngredientClassification } from "@/models/ingredientClassification";
import { Unit } from "@/models/unit";

export function ingredientClassificationReferencingList(
  targetIngredients: Ingredient[],
  ingredientClassification: IngredientClassification
): Ingredient[] {
  const ingredients: Ingredient[] = [];

  targetIngredients.forEach((item: Ingredient) => {
    if (item.isReferenceIngredientClassification(ingredientClassification)) {
      ingredients.push(item);
    }
  });

  return ingredients;
};

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
