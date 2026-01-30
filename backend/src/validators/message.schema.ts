import { z } from "zod";

export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Message content cannot be empty").max(4000, "Message too long"),
  }),
  params: z.object({
    chatSessionId: z.string().uuid("Invalid chat session id"),
  }),
});

export const getMessagesSchema = z.object({
  params: z.object({
    chatSessionId: z.string().uuid("Invalid chat session id"),
  }),
  query: z.object({
    cursor: z.string().uuid().optional(),
    limit: z.coerce.number().min(1).max(50).optional(),
  }),
});
