import { BrewEvent, BrewEventMember } from "@/models/brewEvent";
import { createUUID } from "@/services/utils";
import getDBInstance from "./pouchdb";
import { instanceToPlain } from "class-transformer";

const typename = "ingredient";
const prefix = typename + "-";

export async function fetchAll(): Promise<{
  result: BrewEvent[];
}> {
  const result: BrewEvent[] = [];

  try {
    const fetchResult = await getDBInstance().allDocs<BrewEventMember>({
      include_docs: true,
      startkey: prefix,
      endkey: prefix + "\ufff0",
    });

    fetchResult.rows.forEach(
      (item: {
        doc?:
          | PouchDB.Core.ExistingDocument<
              BrewEventMember & PouchDB.Core.AllDocsMeta
            >
          | undefined;
        id: string;
        key: string;
        value: {
          rev: string;
          deleted?: boolean | undefined;
        };
      }) => {
        if (item.doc) {
          const be = new BrewEvent(
            item.doc.id,
            item.doc.name,
            item.doc.desc,
            item.doc.from,
            item.doc.to,
            item.doc.ingredients,
            item.doc.brewPlanID
          );
          result.push(be);
        }
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    throw new Error(e.name);
  }

  return { result: result };
}

export async function remove(brewEvent: BrewEvent) {
  try {
    const doc = await getDBInstance().get<BrewEventMember>(brewEvent.id);

    try {
      await getDBInstance().remove(doc);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
      throw new Error(e.name);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    throw new Error(e.name);
  }
}

export async function save(brewEvent: BrewEvent): Promise<{ id: string }> {
  const id = brewEvent.id || prefix + createUUID();

  try {
    const doc = await getDBInstance().get<BrewEvent>(id);
    doc.name = brewEvent.name;
    doc.name = brewEvent.name;
    doc.desc = brewEvent.desc;
    doc.from = brewEvent.from;
    doc.to = brewEvent.to;
    doc.ingredients = brewEvent.ingredients;
    try {
      await getDBInstance().put(instanceToPlain(doc));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
      throw new Error(e.name);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // ID検索の結果not_foundが返る => 新規保存
    if (e.name === "not_found") {
      const doc = {
        _id: id,
        type: typename,
        name: brewEvent.name,
        desc: brewEvent.desc,
        from: brewEvent.from,
        to: brewEvent.to,
        ingredients: brewEvent.ingredients,
      };
      try {
        await getDBInstance().put(instanceToPlain(doc));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log(e);
        throw new Error(e.name);
      }
      // ID検索の結果 DBでエラー発生
    } else {
      console.log(e);
      throw new Error(e.name);
    }
  }

  return { id: id };
}
