import SockJS from "sockjs-client";
import { Client, type IMessage } from "@stomp/stompjs";
import type { Message } from "../types/message";

let stompClient: Client | null = null;

export const connectWebSocket = (
  roomId: string,
  onMessage: (msg: Message) => void,
  onTyping?: (msg: string) => void,
  onDelete?: (messageId: string) => void,
  onKick?: (userId: string) => void,
  onParticipantsUpdate?: () => void,
  onConnected?: () => void
) => {
  const token = localStorage.getItem("token");

  const socket = new SockJS(
    `http://localhost:8080/ws?token=${token}`
  );

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ WebSocket Connected");
      if (onConnected) onConnected();

      // ✅ MESSAGE
      stompClient?.subscribe(`/topic/room/${roomId}`, (msg: IMessage) => {
        const data: Message = JSON.parse(msg.body);
        onMessage(data);
      });

      // ✅ TYPING
      if (onTyping) {
        stompClient?.subscribe(
          `/topic/room/${roomId}/typing`,
          (msg: IMessage) => {
            onTyping(msg.body);
          }
        );
      }

      // ✅ DELETE (VERY IMPORTANT)
      if (onDelete) {
        stompClient?.subscribe(
          `/topic/room/${roomId}/delete`,
          (msg: IMessage) => {
            const messageId = msg.body;
            console.log("🗑️ Delete received:", messageId);
            onDelete(messageId);
          }
        );
      }

      // 🔥 KICK USER
      if (onKick) {
        stompClient?.subscribe(
          `/topic/room/${roomId}/kick`,
          (msg: IMessage) => {
            const kickedUserId = msg.body;
            console.log("🚫 User kicked:", kickedUserId);
            onKick(kickedUserId);
          }
        );
      }

      // 🔥 PARTICIPANTS UPDATE
      if (onParticipantsUpdate) {
        stompClient?.subscribe(
          `/topic/room/${roomId}/participants`,
          () => {
            console.log("👥 Participants updated");
            onParticipantsUpdate();
          }
        );
      }
    },

    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame.body);
    },

    onWebSocketError: (error) => {
      console.error("❌ WebSocket error:", error);
    },
  });

  stompClient.activate();
};

// ✅ SEND MESSAGE
export const sendMessage = (message: Message) => {
  if (!stompClient?.connected) {
    console.error("❌ WebSocket not connected");
    return;
  }

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(message),
  });
};

// ✅ SEND TYPING
export const sendTyping = (roomId: string) => {
  if (!stompClient?.connected) return;

  stompClient.publish({
    destination: "/app/chat.typing",
    body: roomId,
  });
};

// ✅ DELETE MESSAGE
export const deleteMessageWS = (messageId: string) => {
  if (!stompClient?.connected) {
    console.error("❌ WebSocket not connected");
    return;
  }

  stompClient.publish({
    destination: "/app/chat.delete",
    body: messageId,
  });
};

// 🔌 DISCONNECT
export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log("🔌 WebSocket Disconnected");
  }
};


// import SockJS from "sockjs-client";
// import { Client, type IMessage } from "@stomp/stompjs";
// import type { Message } from "../types/message";

// let stompClient: Client | null = null;

// export const connectWebSocket = (
//   roomId: string,
//   onMessage: (msg: Message) => void,
//   onTyping?: (msg: string) => void,
//   onDelete?: (messageId: string) => void,
//   onKick?: (userId: string) => void // 🔥 NEW
// ) => {
//   const token = localStorage.getItem("token");

//   const socket = new SockJS(
//     `http://localhost:8080/ws?token=${token}`
//   );

//   stompClient = new Client({
//     webSocketFactory: () => socket,
//     reconnectDelay: 5000,

//     onConnect: () => {
//       console.log("✅ WebSocket Connected");

//       // ✅ MESSAGE
//       stompClient?.subscribe(`/topic/room/${roomId}`, (msg: IMessage) => {
//         const data: Message = JSON.parse(msg.body);
//         onMessage(data);
//       });

//       // ✅ TYPING
//       if (onTyping) {
//         stompClient?.subscribe(
//           `/topic/room/${roomId}/typing`,
//           (msg: IMessage) => {
//             onTyping(msg.body);
//           }
//         );
//       }

//       // ✅ DELETE (ROOM SPECIFIC)
//       if (onDelete) {
//         stompClient?.subscribe(
//           `/topic/room/${roomId}/delete`,
//           (msg: IMessage) => {
//             const messageId = msg.body;
//             onDelete(messageId);
//           }
//         );
//       }

//       // 🔥 KICK USER (NEW)
//       if (onKick) {
//         stompClient?.subscribe(
//           `/topic/room/${roomId}/kick`,
//           (msg: IMessage) => {
//             const kickedUserId = msg.body;
//             console.log("🚫 User kicked:", kickedUserId);
//             onKick(kickedUserId);
//           }
//         );
//       }
//     },

//     onStompError: (frame) => {
//       console.error("❌ STOMP error:", frame.body);
//     },

//     onWebSocketError: (error) => {
//       console.error("❌ WebSocket error:", error);
//     },
//   });

//   stompClient.activate();
// };

// // ✅ SEND MESSAGE
// export const sendMessage = (message: Message) => {
//   if (!stompClient?.connected) {
//     console.error("❌ WebSocket not connected");
//     return;
//   }

//   stompClient.publish({
//     destination: "/app/chat.send",
//     body: JSON.stringify(message),
//   });
// };

// // ✅ SEND TYPING
// export const sendTyping = (roomId: string) => {
//   if (!stompClient?.connected) return;

//   stompClient.publish({
//     destination: "/app/chat.typing",
//     body: roomId,
//   });
// };

// // ✅ DELETE MESSAGE
// export const deleteMessageWS = (messageId: string) => {
//   if (!stompClient?.connected) {
//     console.error("❌ WebSocket not connected");
//     return;
//   }

//   stompClient.publish({
//     destination: "/app/chat.delete",
//     body: messageId,
//   });
// };

// // 🔌 DISCONNECT
// export const disconnectWebSocket = () => {
//   if (stompClient) {
//     stompClient.deactivate();
//     stompClient = null;
//     console.log("🔌 WebSocket Disconnected");
//   }
// };