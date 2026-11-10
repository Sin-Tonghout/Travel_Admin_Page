export interface Tour {
  id: string;
  name: string;
  destination: string;
  durationDays: number;
  /** Adult price in USD. */
  price: number;
  capacity: number;
  published: boolean;
}