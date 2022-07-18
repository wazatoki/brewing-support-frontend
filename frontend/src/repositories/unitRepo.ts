import { Unit } from "@/models/unit";
import { createUUID } from "@/services/utils";
import getDBInstance from "./pouchdb";

export async function fetchAll(): Promise<{
  result: Unit[];
  err: Error | null;
}> {
  const unitIDs: string[] = [];
  const result: Unit[] = [];
  let err: Error | null = null;

  try {
    const unitIDsResult = await getDBInstance().get<{ ids: string[] }>(
      "type-unit-index"
    );
    console.log(unitIDsResult);
    unitIDsResult.ids.forEach((item: string) => {
      unitIDs.push(item);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    err = new Error(e.name);
  }

  try {
    const fetchResult = await getDBInstance().allDocs<Unit>({
      include_docs: true,
      keys: unitIDs,
    });

    fetchResult.rows.forEach(
      (item: {
        doc?:
          | PouchDB.Core.ExistingDocument<Unit & PouchDB.Core.AllDocsMeta>
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
            item.doc.conversionFactor
          );
          u.baseUnit = item.doc.baseUnit;
          result.push(u);
        }
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    err = new Error(e.name);
  }
  return { result: result, err: err };
}

export async function save(
  unit: Unit
): Promise<{ id: string; err: Error | null }> {
  let id = unit.id || createUUID();
  let err: Error | null = null;
  const unitIDs: string[] = [];

  const doc = {
    _id: id,
    type: "unit",
    id: id,
    name: unit.name,
    conversionFactor: unit.conversionFactor,
    baseUnit: unit.baseUnit,
  };

  try {
    const unitIDsResult = await getDBInstance().get<{ ids: string[] }>(
      "type-unit-index"
    );
    unitIDsResult.ids.forEach((item: string) => {
      unitIDs.push(item);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    if (e.status === 404 && e.name === "not_found") {
      const indexDoc = {
        _id: "type-unit-index",
        type: "type-index",
        ids: unitIDs,
      };
      await getDBInstance()
        .put(indexDoc)
        .catch(() => {
          err = new Error("db index error");
        });
    }
  }

  await getDBInstance()
    .put(JSON.parse(JSON.stringify(doc)))
    .catch(() => {
      id = "";
      err = new Error("db error");
    });

  if (unitIDs.includes(id) === false) {
    unitIDs.push(id);
    const indexDoc = await getDBInstance().get<{ ids: string[] }>(
      "type-unit-index"
    );
    indexDoc.ids = unitIDs;
    await getDBInstance()
      .put(indexDoc)
      .catch(() => {
        err = new Error("db index error");
      });
  }

  return { id: id, err: err };
}
