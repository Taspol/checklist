export interface ChecklistItem {
  id: string;
  text: string;
  amount: number;
  isChecked: boolean;
}

export interface ChecklistTable {
  id: string;
  name: string;
  items: ChecklistItem[];
}
