
export type Message = {
  id?: string;
  roomId: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp?: string | null;
  role?: "ADMIN" | "MEMBER"; // 🔥 ADD THIS
};