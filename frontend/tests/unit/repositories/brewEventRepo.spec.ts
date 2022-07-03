import db from "@/repositories/pouchdb";
import { save } from "@/repositories/brewEventRepo";
import { BrewEvent } from "@/models/brewEvent";

afterAll(() => {
  db.destroy();
});

describe("brewEventServices.ts", () => {
  it("renders id when passed", async () => {

    const promise1 = new Promise<PouchDB.Core.Response>((resolve, reject) => {
      resolve({ ok: true, id: "1asd", rev: "1asc" });
    });

    jest.spyOn(db, "put").mockReturnValue(promise1);

    
    const be = new BrewEvent();

    const result = await save(be);
    expect(result.err).toEqual(null);
    expect(db.put).toBeCalled();
  });
});
