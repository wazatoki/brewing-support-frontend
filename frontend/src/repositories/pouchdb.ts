import PouchDB from "pouchdb";

export class CouchDbProvider {
    getCouchDb(dbName:string = "brewing_support_db"): PouchDB.Database<{}> {

        return new PouchDB(
            `${dbName}`,
            {
                skip_setup: true
            });
    }
}
export default new CouchDbProvider();
