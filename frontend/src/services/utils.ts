import { v4 as uuidv4 } from "uuid";

export function createUUID() {
  const d = new Date();
  const uid = d.toJSON() + "-" + uuidv4();
  return uid;
}
