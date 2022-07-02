import { v4 as uuidv4 } from "uuid";

export function createUUID() {
  const d = new Date();
  const uid = d.toISOString() + uuidv4();
  return uid;
}
