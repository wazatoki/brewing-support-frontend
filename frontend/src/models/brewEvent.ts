import { ConsumedIngredient } from "./consumedIngredient";

export class BrewEvent {
  id: string;
  name: string;
  desc: string;
  from: Date;
  to: Date;
  ingredients: ConsumedIngredient[];
  brewPlanID: string;

  constructor(
    id = "",
    name = "",
    desc = "",
    from = new Date(),
    to = new Date(),
    ingredients = [] as ConsumedIngredient[],
    brewPlanID = ""
  ) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.from = from;
    this.to = to;
    this.ingredients = ingredients;
    this.brewPlanID = brewPlanID;
  }
}

export interface BrewEventMember {
  id: string;
  name: string;
  desc: string;
  from: Date;
  to: Date;
  ingredients: ConsumedIngredient[];
  brewPlanID: string;
}
