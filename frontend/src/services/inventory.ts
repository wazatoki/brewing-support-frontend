import { Inventory } from "@/models/inventory";

export function sortByDate(
  inventories: Inventory[]
): Inventory[] {
  inventories.sort((item_a, item_b) => {
    if (item_a.onDate > item_b.onDate) {
      return 1;
    }
    return -1;
  });
  return inventories;
}
