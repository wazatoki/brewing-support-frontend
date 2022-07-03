import PouchDB from "pouchdb";

let db: PouchDB.Database<{}>;

export default function getDBInstance(dbName: string = "brewing_support_db"): PouchDB.Database<{}> {

    if (db.info.name === dbName) {
        return db;
    }

    return db = new PouchDB(
        `${dbName}`,
        {
            skip_setup: true
        }
    );
    
}

// export class CouchDbProvider {

//     private db: PouchDB.Database<{}>;

//     getCouchDb(dbName:string = "brewing_support_db"): PouchDB.Database<{}> {

//         if

//         return new PouchDB(
//             `${dbName}`,
//             {
//                 skip_setup: true
//             });
//     }
// }
// export default new CouchDbProvider();
