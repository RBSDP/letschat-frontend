import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
  sendTyping,
  deleteMessageWS,
} from "../services/websocket";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import {
  useGetMessagesQuery,
  useGetParticipantsQuery,
  api,
} from "../services/api";
import ParticipantsPanel from "../components/ParticipantsPanel";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import type { Message } from "../types/message";

function Chat() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ FETCH MESSAGES
  const { data: historyData, refetch } = useGetMessagesQuery(
    { roomId: roomId! },
    { skip: !roomId }
  );

  // ✅ FETCH PARTICIPANTS
  const {
    data: participantsData,
    refetch: refetchParticipants,
  } = useGetParticipantsQuery(
    { roomId: roomId! },
    { skip: !roomId }
  );

  // ✅ ROLE CHECK (CORRECT SOURCE)
  const currentUserRole =
    participantsData?.data?.find((p) => p.userId === user?.id)?.role;

  const isAdmin = currentUserRole === "ADMIN";

  // ✅ WEBSOCKET
  useEffect(() => {
    if (!roomId) return;

    connectWebSocket(
      roomId,

      // MESSAGE
      (msg: Message) => {
        if (!msg.id) return;

        setRealtimeMessages((prev) => {
          const exists = prev.some((m) => m.id === msg.id);
          return exists ? prev : [...prev, msg];
        });
      },

      // TYPING
      (typing: string) => {
        setTypingUser(typing);
        setTimeout(() => setTypingUser(null), 1500);
      },

      // DELETE
      (messageId: string) => {
        setRealtimeMessages((prev) =>
          prev.filter((m) => m.id !== messageId)
        );

        dispatch(
          api.util.updateQueryData(
            "getMessages",
            { roomId: roomId! },
            (draft) => {
              draft.data.content = draft.data.content.filter(
                (msg) => msg.id !== messageId
              );
            }
          )
        );
      },

      // KICK
      (kickedUserId: string) => {
        if (kickedUserId === user?.id) {
          toast.error("You were removed from the room");
          disconnectWebSocket();
          navigate("/");
        }
      },

      // PARTICIPANTS UPDATE
      () => {
        refetchParticipants();
      },

      // CONNECTED
      () => {
        refetch();
      }
    );

    return () => disconnectWebSocket();
  }, [roomId, user?.id, dispatch, navigate, refetch, refetchParticipants]);

  // ✅ MERGE + UNIQUE + SORT
  const allMessages: Message[] = [
    ...(historyData?.data?.content || []),
    ...realtimeMessages,
  ]
    .filter(
      (msg, index, self) =>
        msg.id &&
        index === self.findIndex((m) => m.id === msg.id)
    )
    .sort((a, b) => {
      if (!a.timestamp) return -1;
      if (!b.timestamp) return 1;

      return (
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
      );
    });

  // ✅ AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // ✅ SEND MESSAGE
  const handleSend = () => {
    if (!input.trim() || !roomId || !user) return;

    sendMessage({
      roomId,
      senderId: user.id,
      content: input,
      senderName: user.username,
      timestamp: new Date().toISOString(),
    });

    setInput("");
  };

  // ✅ DELETE MESSAGE
  const handleDelete = (id?: string) => {
    if (!id) return;

    deleteMessageWS(id);

    setRealtimeMessages((prev) =>
      prev.filter((m) => m.id !== id)
    );
  };

  return (
    <div className="h-screen flex bg-gray-100">

      {/* CHAT */}
      <div className="flex-1 flex flex-col">

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {allMessages.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              No messages yet
            </p>
          )}

          {allMessages.map((msg, i) => {
            const isOwn = msg.senderId === user?.id;
            const canDelete = isAdmin || isOwn;

            return (
              <div
                key={msg.id || i}
                className={`flex ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`group relative px-4 py-2 rounded-2xl shadow max-w-xs ${
                    isOwn
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-black rounded-bl-none border"
                  }`}
                >
                  {canDelete && msg.id && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="hidden group-hover:block absolute top-1 right-1 text-xs text-red-400"
                    >
                      ✕
                    </button>
                  )}

                  <p className="text-sm font-semibold">
                    {msg.senderName || "User"}
                  </p>

                  <p>{msg.content}</p>

                  <p className="text-xs opacity-70 text-right mt-1">
                    {msg.timestamp
                      ? dayjs(msg.timestamp).format("hh:mm A")
                      : ""}
                  </p>
                </div>
              </div>
            );
          })}

          {typingUser && (
            <p className="text-sm text-gray-500 px-2">
              {typingUser}
            </p>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t bg-white flex gap-2">
          <input
            className="flex-1 border rounded-full px-4 py-2 outline-none"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (roomId) sendTyping(roomId);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Type a message..."
          />

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-500 disabled:bg-gray-300 text-white px-4 rounded-full"
          >
            Send
          </button>
        </div>
      </div>

      {/* PARTICIPANTS */}
      <div className="w-72 border-l bg-white">
        {roomId && <ParticipantsPanel roomId={roomId!} />}
      </div>
    </div>
  );
}

export default Chat;