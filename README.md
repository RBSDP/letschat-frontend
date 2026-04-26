# 💬 Real-Time Chat Frontend

Frontend for a real-time chat application built with **React, TypeScript, and WebSockets**.

---

## 🚀 Features

### 💬 Real-Time Messaging

* Instant message updates using WebSockets (STOMP + SockJS)
* No page refresh required

### 👥 Room-Based Chat

* Join chat rooms
* Multi-user communication

### 🛡 Role-Based UI

* Admin can delete all messages
* Members can delete only their own messages

### ⚡ Live Updates

* Messages sync instantly
* Participants list updates in real-time
* User removal (kick) handled live

### ✍️ Typing Indicator

* Shows when a user is typing

### 🎨 UI/UX

* Clean chat interface
* Auto-scroll to latest messages
* Toast notifications (no alerts)
* Responsive layout

---

## 🧱 Tech Stack

* React
* TypeScript
* Redux Toolkit (RTK Query)
* Tailwind CSS
* WebSocket (STOMP + SockJS)
* react-hot-toast
* dayjs

---

## ⚙️ Setup

```bash
git clone https://github.com/RBSDP/letschat-frontend
cd letschat-frontend
npm install
npm run dev
```

---

## 🔌 Backend Connection

Update API base URL:

```ts
baseUrl: "https://your-backend-url/api/v1"
```

Update WebSocket:

```ts
new SockJS("https://your-backend-url/ws")
```

---

## 🌐 Deployment

* Deployed on Netlify

---

## 🧠 Key Learnings

* Real-time UI synchronization using WebSockets
* Managing server state with RTK Query
* Role-based UI rendering
* Handling live updates without refetch


