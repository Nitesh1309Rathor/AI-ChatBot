-- DropIndex
DROP INDEX "ChatSession_userId_idx";

-- DropIndex
DROP INDEX "Message_chatSessionId_idx";

-- CreateIndex
CREATE INDEX "ChatSession_userId_createdAt_idx" ON "ChatSession"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_chatSessionId_createdAt_idx" ON "Message"("chatSessionId", "createdAt");
