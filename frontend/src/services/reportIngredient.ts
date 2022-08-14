import { ReportIngredient } from "@/models/reportIngredient";
import * as processingType from "@/models/processingType";

export const comsumedQuantity = (
  ingredientID: string,
  reportingIngredients: ReportIngredient[]
) =>
  reportingIngredients
    .filter((item) => {
      if (
        item.processingType === processingType.brewing &&
        item.ingredient.id === ingredientID
      ) {
        return true;
      }
      return false;
    })
    .reduce((acc, elem) => Number(acc) + Number(elem.quantity), 0);

export const recievedQuantity = (
  ingredientID: string,
  reportingIngredients: ReportIngredient[]
) =>
  reportingIngredients
    .filter((item) => {
      if (
        item.processingType === processingType.recieving &&
        item.ingredient.id === ingredientID
      ) {
        return true;
      }
      return false;
    })
    .reduce((acc, elem) => Number(acc) + Number(elem.quantity), 0);
