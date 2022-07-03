import PouchDB from "pouchdb";
import couchDbProvider from "@/repositories/pouchdb";
import { save } from "@/repositories/brewEventRepo";
import { BrewEvent } from "@/models/brewEvent";

jest.mock('@/repositories/pouchdb');
jest.mock('pouchdb');
const mockedCouchDbProvider = couchDbProvider as jest.Mocked<typeof couchDbProvider>;

// This is actually creates a **mocked pouchDb instance**. When we told Jest to import the pouchDb module it replaced constructors with ones that creates mocks.
const mockedPouchDbInstance = new PouchDB(); 

// We do this just so we can configure the mock pouchDb's methods in a type safe way.
const mockedPouchDbConfig = mockedPouchDbInstance as jest.Mocked<typeof mockedPouchDbInstance>;

mockedCouchDbProvider.getCouchDb.mockReturnValue(mockedPouchDbInstance);

describe("brewEventRepo.ts", () => {
  it("renders id when passed", async () => {

    const promise1 = new Promise<PouchDB.Core.Response>((resolve, reject) => {
      resolve({ ok: true, id: "1asd", rev: "1asc" });
    });
    
    mockedPouchDbConfig.put.mockResolvedValue(promise1);

    const be = new BrewEvent();

    const result = await save(be);
    expect(result.err).toEqual(null);
    expect(mockedPouchDbConfig.put).toBeCalled();
  });
});
