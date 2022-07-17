import { Unit } from "@/models/unit";
import { createUUID } from "@/services/utils";
import getDBInstance from "./pouchdb";

export async function fetchAll(): Promise<{
  result: Unit[];
  err: Error | null;
}> {
  const unitIDs: string[] = [];
  const result: Unit[] = [];
  const err: Error | null = null;

  try {
    const unitIDsResult = await getDBInstance().get<{ ids: string[] }>(
      "type-unit-index"
    );
    unitIDsResult.ids.forEach((item: string) => {
      unitIDs.push(item);
    });
  } catch (e) {
    console.log(e);
  }

  try {
    const fetchResult = await getDBInstance().allDocs<{
      type: string;
      id: string;
      name: string;
      conversionFactor: number;
      baseUnit: Unit;
    }>({ include_docs: true, keys: unitIDs });

    fetchResult.rows.forEach(
      (item: {
        doc?:
          | PouchDB.Core.ExistingDocument<
              {
                type: string;
                id: string;
                name: string;
                conversionFactor: number;
                baseUnit: Unit;
              } & PouchDB.Core.AllDocsMeta
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
          const u = new Unit(
            item.doc.id,
            item.doc.name,
            item.doc.conversionFactor,
            item.doc.baseUnit
          );
          result.push(u);
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
  return { result: result, err: err };
}

export async function save(
  unit: Unit
): Promise<{ id: string; err: Error | null }> {
  let id = unit.id || createUUID();
  let err: Error | null = null;
  const doc = {
    _id: id,
    type: "unit",
    id: id,
    name: unit.name,
    conversionFactor: unit.conversionFactor,
    baseUnit: unit.baseUnit,
  };

  await getDBInstance()
    .put(doc)
    .catch(() => {
      id = "";
      err = new Error("db error");
    });

  return { id: id, err: err };
}
