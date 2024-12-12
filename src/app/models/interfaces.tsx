interface Metric {
  id: number;
  value: number;
  unitName: string;
  unitType: string;
  unit: string;
  date: string;
  username: string;
  fullName: string;
}

// Unit Interface
interface Unit {
  name: string;
  unit_type: string;
  unit: string;
}

export type { Metric, Unit };