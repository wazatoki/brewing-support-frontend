import { Unit, UnitMenber } from "@/models/unit";
import { createUUID } from "@/services/utils";
import getDBInstance from "./pouchdb";
import { instanceToPlain } from "class-transformer";

const typename = "unit";
const prefix = typename + "-";

export async function fetchAll(): Promise<{
  result: Unit[];
}> {
  const result: Unit[] = [];

  try {
    const fetchResult = await getDBInstance().allDocs<UnitMenber>({
      include_docs: true,
      startkey: prefix,
      endkey: prefix + "\ufff0",
    });

    fetchResult.rows.forEach(
      (item: {
        doc?:
          | PouchDB.Core.ExistingDocument<UnitMenber & PouchDB.Core.AllDocsMeta>
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
    throw new Error(e.name);
  }

  return { result: result };
}

export async function remove(unit: Unit) {
  const checkRemovable = await isRemovable(unit);
  if (checkRemovable.result) {
    try {
      const doc = await getDBInstance().get<UnitMenber>(unit.id);

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
  } else {
    throw new Error("参照データがあり削除できません。");
  }
}

async function isRemovable(
  unit: Unit
): Promise<{ result: boolean; units: Unit[] }> {
  const units: Unit[] = [];
  try {
    const fetchedUnits: Unit[] = await (await fetchAll()).result;
    fetchedUnits.forEach((item: Unit) => {
      if (item.baseUnit && item.baseUnit.id === unit.id) {
        units.push(item);
      }
    });

    if (units.length > 0) {
      return { result: false, units: units };
    }
    return { result: true, units: units };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    throw new Error(e.name);
  }
}

export async function save(unit: Unit): Promise<{ id: string }> {
  const id = unit.id || prefix + createUUID();

  try {
    const doc = await getDBInstance().get<UnitMenber>(id);
    doc.name = unit.name;
    doc.conversionFactor = unit.conversionFactor;
    doc.baseUnit = unit.baseUnit;
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
        type: "unit",
        id: id,
        name: unit.name,
        conversionFactor: unit.conversionFactor,
        baseUnit: unit.baseUnit,
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
