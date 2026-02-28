export function generateChatTitle(content: string) {
  const trimmed = content.trim();

  if (trimmed.length <= 20) {
    return trimmed;
  }

  return trimmed.slice(0, 20) + "...";
}
