import { db } from "@/services/pouchdb";
import { save } from "@/services/brewEventServices";
import { BrewEvent } from "@/models/brewEvent";

jest.mock("@/services/pouchdb");

describe("brewEventServices.ts", () => {
  it("renders id when passed", async () => {
    const be = new BrewEvent();

    const result = await save(be);
    expect(result).toMatch("iiiii");
    expect(db.put).toBeCalled();
  });
});
