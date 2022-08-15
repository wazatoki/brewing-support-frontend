export class Inventory {
  id: string;
  onDate: Date;
  resultValue: number;
  calculatedValue: number;
  adjustedValue: number;
  note: string;

  constructor(
    id = "",
    onDate = new Date(),
    resultValue = 0,
    calculatedValue: number,
    adjustedValue = 0,
    note = ""
  ) {
    this.id = id;
    this.onDate = onDate;
    this.resultValue = resultValue;
    this.calculatedValue = calculatedValue;
    this.adjustedValue = adjustedValue;
    this.note = note;
  }
}

export interface InventoryMember {
  id: string;
  onDate: Date;
  resultValue: number;
  calculatedValue: number;
  adjustedValue: number;
  note: string;
}
