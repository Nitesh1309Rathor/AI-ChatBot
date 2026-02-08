## Gemini API + SSE Streaming (Backend + Frontend)

## Goal

- Build a chat system where:

- AI responses stream token-by-token

- Backend uses Gemini API

- Streaming is done using SSE

- Frontend renders live AI output smoothly

## This guide is framework-agnostic (works with Express + React / Next.js).

0️⃣ Core Architecture (Read First)
❌ What we DO NOT want

Waiting for full AI response

Returning entire text at once

Blocking UI

✅ What we DO want
Client
↓ POST /messages/stream
Server
├─ Save USER message
├─ Call Gemini
├─ Stream tokens via SSE
├─ Save AI message when done
└─ Close connection

One request = one streaming response

## 1️⃣ Environment Setup

.env
PORT=4000
JWT_SECRET=super-secret-key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
NEXT_PUBLIC_API_URL=http://localhost:4000

## 2️⃣ Backend — Gemini API Wrapper

📁 backend/src/utils/ai.ts

- This function calls Gemini once, then simulates token streaming
  (SSE stays real even if Gemini doesn’t stream)

const GEMINI_ENDPOINT =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

type StreamHandlers = {
onToken: (token: string) => void;
onComplete: () => Promise<void>;
};

export async function streamAIResponse(
prompt: string,
handlers: StreamHandlers
) {
const res = await fetch(
`${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`,
{
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
contents: [
{
parts: [{ text: prompt }],
},
],
}),
}
);

if (!res.ok) {
throw new Error("AI response generation failed");
}

const json = await res.json();
const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

// Simulated token streaming
for (const word of text.split(" ")) {
handlers.onToken(word + " ");
await new Promise((r) => setTimeout(r, 20));
}

await handlers.onComplete();
}

## 3️⃣ Backend — SSE Controller

## 📁 backend/src/controllers/message.controller.ts

async streamMessageController(req: Request, res: Response) {
const userId = req.userId;
const chatSessionId = req.params.chatSessionId;
const { content } = req.body;

res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");
res.flushHeaders();

await MessageService.streamMessageService(
userId,
chatSessionId,
content,
res
);
}

## 4️⃣ Backend — Message Streaming Service

## 📁 backend/src/services/message.service.ts

async streamMessageService(
userId: string,
chatSessionId: string,
content: string,
res: Response
) {
// 1. Ownership check
const chat = await ChatDao.findChatById(chatSessionId);
if (!chat || chat.userId !== userId) {
throw new Error("Unauthorized");
}

// 2. Save USER message
const userMessage = await MessageDao.createMessage({
chatSessionId,
role: "USER",
content,
});

res.write(`event: meta\ndata: ${JSON.stringify({ userMessage })}\n\n`);

let fullAIResponse = "";

try {
await streamAIResponse(content, {
onToken(token) {
fullAIResponse += token;
res.write(`data: ${token}\n\n`);
},

      async onComplete() {
        const aiMessage = await MessageDao.createMessage({
          chatSessionId,
          role: "ASSISTANT",
          content: fullAIResponse,
        });

        res.write(`event: done\ndata: ${JSON.stringify({ aiMessage })}\n\n`);
        res.end();
      },
    });

} catch (err) {
res.write(`event: error\ndata: AI streaming failed\n\n`);
res.end();
}
}

## 5️⃣ Backend — Route

## 📁 backend/src/routes/message.routes.ts

router.post(
"/api/chats/:chatSessionId/messages/stream",
requireAuth,
validate(sendMessageSchema),
MessageController.streamMessageController
);

## 6️⃣ Frontend — Streaming Fetch Helper

## 📁 frontend/src/lib/api/messages.ts

export async function streamMessage({
chatSessionId,
content,
onToken,
onDone,
onError,
}: {
chatSessionId: string;
content: string;
onToken: (chunk: string) => void;
onDone: () => void;
onError: (err: unknown) => void;
}) {
try {
const token = LOCAL_STORAGE.getToken();

    const res = await fetch(
      `${API_BASE_URL}/api/chats/${chatSessionId}/messages/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!res.ok || !res.body) {
      throw new Error("Streaming failed");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          onToken(line.replace("data: ", ""));
        }
      }
    }

    onDone();

} catch (err) {
onError(err);
}
}

## 7️⃣ Frontend — Chat State Management

- Key principles

History messages → from DB

Live messages → streaming only

One AI message per request

Append tokens into same message

## 8️⃣ Frontend — ChatMainPanel (Core Logic)

const userMessage = { role: "USER", content };
const aiMessage = { role: "ASSISTANT", content: "" };

setLiveMessages((prev) => [...prev, userMessage, aiMessage]);

await streamMessage({
chatSessionId,
content,

onToken(chunk) {
setLiveMessages((prev) =>
prev.map((m) =>
m === aiMessage ? { ...m, content: m.content + chunk } : m
)
);
},

onDone() {
setAiPending(false);
},
});

## 9️⃣ Frontend — Auto-Scroll Rules (IMPORTANT)

✅ Correct behavior

Auto-scroll only if user is near bottom

Stop auto-scroll when user scrolls up

Resume when user scrolls back down

❌ Never do
useEffect(() => {
scrollToBottom();
}, [messages]);

This causes forced scrolling bugs.

🔟 Why sendMessage() (non-stream) is NOT needed
❌ Old approach
sendMessage() {
callAI()
wait full response
save AI
}

✅ New approach
streamMessageService() {
stream tokens
save AI at end
}

Never keep two AI generation paths
