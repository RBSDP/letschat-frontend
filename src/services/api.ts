import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Message } from "../types/message";

// 🔐 AUTH
type AuthResponse = {
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
};

// 💬 PAGINATION
type PaginatedMessages = {
  content: Message[];
  totalPages: number;
  totalElements: number;
  number: number;
};

// 👤 USER
type UserResponse = {
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
  };
};

// 🏠 ROOM
type RoomResponse = {
  message: string;
  data: {
    id: string;
    name: string;
  };
};

// 🔁 GENERIC
type ApiResponse<T> = {
  message: string;
  data: T;
};

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    getMe: builder.query<UserResponse, void>({
      query: () => "/auth/me",
    }),

    createRoom: builder.mutation<RoomResponse, { roomId: string }>({
      query: (data) => ({
        url: "/rooms",
        method: "POST",
        body: data,
      }),
    }),

    joinRoom: builder.mutation<ApiResponse<string>, { roomId: string }>({
      query: (data) => ({
        url: `/rooms/join`,
        method: "POST",
        body: data,
      }),
    }),

    // ✅ CLEAN & CORRECT
    getMessages: builder.query<
      ApiResponse<PaginatedMessages>,
      { roomId: string; page?: number; size?: number }
    >({
      query: ({ roomId, page = 0, size = 100 }) => ({
        url: `/message/${roomId}?page=${page}&size=${size}`,
      }),
    }),

    deleteMessage: builder.mutation<
  { message: string; data: null },
  { messageId: string }
>({
  query: ({ messageId }) => ({
    url: `/message/${messageId}`,
    method: "DELETE",
  }),
}),

// 👥 GET PARTICIPANTS
getParticipants: builder.query<
  { message: string; data: { userId: string; username?: string; role: string }[] },
  { roomId: string }
>({
  query: ({ roomId }) => `/rooms/${roomId}/participants`,
}),

// ❌ REMOVE USER
removeUser: builder.mutation<
  { message: string },
  { roomId: string; userId: string }
>({
  query: ({ roomId, userId }) => ({
    url: `/rooms/${roomId}/users/${userId}`,
    method: "DELETE",
  }),
}),
  }),
});

// ✅ EXPORTS
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useCreateRoomMutation,
  useJoinRoomMutation,
  useGetMessagesQuery,
  useDeleteMessageMutation,
  useGetParticipantsQuery,
  useRemoveUserMutation,
} = api;