export type NotificationType = "booking" | "payment" | "review" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const initialNotifications: AppNotification[] = [
  { id: "n1", type: "booking", title: "New booking received", body: "Mia Tanaka booked Angkor Sunrise Tour.", time: "5 min ago", read: false },
  { id: "n2", type: "payment", title: "Payment failed", body: "Card declined for BK-1006.", time: "32 min ago", read: false },
  { id: "n3", type: "review", title: "New 5-star review", body: "Kulen Mountain was rated 5 stars.", time: "2 h ago", read: false },
  { id: "n4", type: "booking", title: "Booking cancelled", body: "Noah Smith cancelled BK-1004.", time: "Yesterday", read: true },
  { id: "n5", type: "system", title: "Backup completed", body: "Nightly backup finished successfully.", time: "Yesterday", read: true },
];