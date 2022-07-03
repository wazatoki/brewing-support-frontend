import { BrewEvent } from "@/models/brewEvent";
import { createUUID } from "@/services/utils";
import couchDbProvider from "./pouchdb";

export async function save(
  brewEvent: BrewEvent
): Promise<{ id: string; err: Error | null }> {
  let id = brewEvent.id || createUUID();
  let err: Error | null = null;
  const doc = {
    _id: id,
    type: "brew_event",
    id: id,
    name: brewEvent.name,
    desc: brewEvent.desc,
    from: brewEvent.from,
    to: brewEvent.to,
    ingredients: brewEvent.ingredients,
  };

  await couchDbProvider.getCouchDb().put(doc).catch(() => {
    id = "";
    err = new Error("db error");
  });

  return { id: id, err: err };
}
