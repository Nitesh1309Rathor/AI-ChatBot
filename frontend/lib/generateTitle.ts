export function generateChatTitle(content: string) {
  return content.trim().split(/\s+/).slice(0, 6).join(" ") + "...";
}
