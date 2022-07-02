import { BrewEvent } from "./brewEvent";

export class BrewPlan {
  id: string;
  name: string;
  events: BrewEvent[];

  constructor(id = "", name = "", events = [] as BrewEvent[]) {
    this.id = id;
    this.name = name;
    this.events = events;
  }
}
