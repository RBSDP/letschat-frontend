import { useState } from "react";
import {
  useCreateRoomMutation,
  useJoinRoomMutation,
} from "../services/api";
import { useNavigate } from "react-router-dom";

function Rooms() {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");

  const [createRoom] = useCreateRoomMutation();
  const [joinRoom] = useJoinRoomMutation();

  const navigate = useNavigate();

  // 🔥 Create Room
  const handleCreate = async () => {
    try {
      const res = await createRoom({ roomId: roomName }).unwrap();

      const id = res.data; // ✅ now string
    navigate(`/chat/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create room");
    }
  };

  // 🔥 Join Room
  const handleJoin = async () => {
    try {
      await joinRoom({ roomId }).unwrap();

      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to join room");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-md space-y-6">

        <h1 className="text-2xl font-bold text-center">Rooms</h1>

        {/* Create Room */}
        <div className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="font-semibold">Create Room</h2>

          <input
            className="w-full border p-2 rounded"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <button
            onClick={handleCreate}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Create
          </button>
        </div>

        {/* Join Room */}
        <div className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="font-semibold">Join Room</h2>

          <input
            className="w-full border p-2 rounded"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button
            onClick={handleJoin}
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Join
          </button>
        </div>

      </div>
    </div>
  );
}

export default Rooms;