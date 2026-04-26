// import {
//   useGetParticipantsQuery,
//   useRemoveUserMutation,
// } from "../services/api";
// import { useAppSelector } from "../hooks/hooks";

// type Props = {
//   roomId: string;
// };

// function ParticipantsPanel({ roomId }: Props) {
//   const { user } = useAppSelector((state) => state.auth);

  
//   const [removeUser] = useRemoveUserMutation();
//   const { data, refetch } = useGetParticipantsQuery({ roomId });

//   const participants = data?.data || [];

//   // 🔥 detect admin
//   const isAdmin = participants.some(
//     (p) => p.userId === user?.id && p.role === "ADMIN"
//   );

//   const handleRemove = async (userId: string) => {
//     try {
//       await removeUser({ roomId, userId }).unwrap();
//     } catch (err) {
//       console.error("Remove failed", err);
//     }
//   };

//   return (
//     <div className="w-64 border-l p-3 bg-gray-50">
//       <h2 className="font-semibold mb-3">Members</h2>

//       <div className="space-y-2">
//         {participants.map((p) => (
//           <div
//             key={p.userId}
//             className="flex justify-between items-center bg-white p-2 rounded"
//           >
//             <div>
//               <p className="text-sm font-medium">{p.username || p.userId}</p>
//               <p className="text-xs text-gray-500">{p.role}</p>
//             </div>

//             {/* 🔥 ADMIN ONLY */}
//             {isAdmin && p.userId !== user?.id && (
//               <button
//                 onClick={() => handleRemove(p.userId)}
//                 className="text-red-500 text-xs"
//               >
//                 Remove
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ParticipantsPanel;


import {
  useGetParticipantsQuery,
  useRemoveUserMutation,
} from "../services/api";
import { useAppSelector } from "../hooks/hooks";

type Props = {
  roomId: string;
};

function ParticipantsPanel({ roomId }: Props) {
  const { user } = useAppSelector((state) => state.auth);

  const [removeUser] = useRemoveUserMutation();
  const { data } = useGetParticipantsQuery({ roomId });

  const participants = data?.data || [];

  const isAdmin = participants.some(
    (p) => p.userId === user?.id && p.role === "ADMIN"
  );

  const handleRemove = async (userId: string) => {
    try {
      await removeUser({ roomId, userId }).unwrap();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  return (
    <div className="w-64 border-l p-3 bg-gray-50">
      <h2 className="font-semibold mb-3">Members</h2>

      <div className="space-y-2">
        {participants.map((p) => (
          <div
            key={p.userId}
            className="flex justify-between items-center bg-white p-2 rounded"
          >
            <div>
              <p className="text-sm font-medium">
                {p.username || p.userId}
              </p>
              <p className="text-xs text-gray-500">{p.role}</p>
            </div>

            {isAdmin && p.userId !== user?.id && (
              <button
                onClick={() => handleRemove(p.userId)}
                className="text-red-500 text-xs"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParticipantsPanel;