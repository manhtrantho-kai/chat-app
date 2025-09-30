# Discord Clone Chat App

Ứng dụng chat giống Discord được xây dựng với React/Next.js và tích hợp với backend Go.

## Tính năng

- ✅ Tổ chức theo mô hình Clan (Server), Category, Channel
- ✅ Gửi tin nhắn text
- ✅ Gửi hình ảnh (nhiều ảnh cùng lúc)
- ✅ Gửi sticker và emoji
- ✅ Giao diện dark theme giống Discord
- ✅ Real-time messaging với WebSocket
- ✅ API client để tích hợp với Go backend

## Cấu trúc dự án

\`\`\`
├── app/
│   ├── page.tsx              # Trang chính
│   ├── layout.tsx            # Layout chung
│   └── globals.css           # Styles toàn cục
├── components/
│   ├── server-sidebar.tsx    # Sidebar danh sách server/clan
│   ├── channel-sidebar.tsx   # Sidebar danh sách channel
│   ├── chat-area.tsx         # Khu vực chat chính
│   ├── message-list.tsx      # Danh sách tin nhắn
│   ├── message-input.tsx     # Input gửi tin nhắn
│   └── sticker-picker.tsx    # Picker chọn sticker/emoji
├── hooks/
│   ├── use-chat.ts           # Hook quản lý chat
│   ├── use-clans.ts          # Hook quản lý clans
│   └── use-websocket.ts      # Hook WebSocket connection
├── lib/
│   ├── types.ts              # TypeScript types
│   ├── api.ts                # API client
│   └── mock-data.ts          # Dữ liệu mẫu
\`\`\`

## API Endpoints (Go Backend)

### Clans
- `GET /api/clans` - Lấy danh sách clans
- `GET /api/clans/:id` - Lấy thông tin clan

### Categories
- `GET /api/clans/:clanId/categories` - Lấy categories của clan

### Channels
- `GET /api/clans/:clanId/channels` - Lấy channels của clan
- `GET /api/channels/:id` - Lấy thông tin channel

### Messages
- `GET /api/channels/:channelId/messages?limit=50` - Lấy tin nhắn
- `POST /api/channels/:channelId/messages` - Gửi tin nhắn
  - Body: `FormData` với `content` và `attachments[]`
- `POST /api/channels/:channelId/messages` - Gửi sticker
  - Body: `{ "stickerId": "string" }`

### Stickers
- `GET /api/stickers` - Lấy danh sách stickers

### WebSocket
- `ws://localhost:8080/ws` - WebSocket endpoint cho real-time messaging

## Environment Variables

Tạo file `.env.local`:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
\`\`\`

## Cách sử dụng

### 1. Cài đặt dependencies

\`\`\`bash
npm install
# hoặc
yarn install
\`\`\`

### 2. Chạy development server

\`\`\`bash
npm run dev
# hoặc
yarn dev
\`\`\`

### 3. Tích hợp với Go Backend

Ứng dụng sử dụng `ApiClient` trong `lib/api.ts` để giao tiếp với backend Go. Các hooks trong `hooks/` folder giúp quản lý state và API calls:

\`\`\`typescript
// Sử dụng hook để fetch và gửi messages
const { messages, sendMessage, sendSticker } = useChat(channelId)

// Gửi tin nhắn text
await sendMessage("Hello world!")

// Gửi tin nhắn với hình ảnh
await sendMessage("Check this out!", [imageFile1, imageFile2])

// Gửi sticker
await sendSticker("sticker-id")
\`\`\`

### 4. WebSocket Integration

Sử dụng `useWebSocket` hook để kết nối real-time:

\`\`\`typescript
const { send, isConnected } = useWebSocket({
  url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws",
  onMessage: (message) => {
    // Xử lý tin nhắn real-time
    console.log("Received:", message)
  },
  onConnect: () => console.log("Connected to WebSocket"),
  onDisconnect: () => console.log("Disconnected from WebSocket"),
})
\`\`\`

## Go Backend Requirements

Backend Go cần implement các endpoints và WebSocket handler như mô tả ở trên. Dữ liệu trả về cần match với TypeScript types trong `lib/types.ts`.

### Example Response Format

\`\`\`json
// GET /api/channels/:channelId/messages
[
  {
    "id": "1",
    "content": "Hello!",
    "authorId": "user-1",
    "author": {
      "id": "user-1",
      "username": "John",
      "avatar": "https://...",
      "status": "online"
    },
    "channelId": "channel-1",
    "createdAt": "2025-01-01T00:00:00Z",
    "attachments": [],
    "sticker": null
  }
]
\`\`\`

## Công nghệ sử dụng

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **date-fns** - Date formatting
- **WebSocket** - Real-time communication

## Tùy chỉnh

- Màu sắc: Chỉnh sửa trong `app/globals.css`
- API URL: Thay đổi trong `.env.local`
- Mock data: Chỉnh sửa trong `lib/mock-data.ts`
