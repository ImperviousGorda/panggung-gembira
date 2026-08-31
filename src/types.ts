export interface Seat {
  id: number;
  label: string;
  isOccupied: boolean;
  row: string;
  col: number;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  message: string;
}

export interface ShowBabak {
  title: string;
  description: string;
  time: string;
}
