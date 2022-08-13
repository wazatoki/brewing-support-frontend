import { RecieveEvent } from "@/models/recieveEvent";

export function sortBySupplierNameAndRecieveDate(
  recieveEvents: RecieveEvent[]
): RecieveEvent[] {
  recieveEvents.sort((item_a, item_b) => {
    if (item_a.supplier && item_b.supplier) {
      if (item_a.supplier.name > item_b.supplier.name) {
        return 1;
      }
      if (item_a.supplier.name < item_b.supplier.name) {
        return -1;
      }
      return -1;
      if (item_a.recieveDate > item_b.recieveDate) {
        return 1;
      }
      return -1;
    }
    return 0;
  });

  return recieveEvents;
}
