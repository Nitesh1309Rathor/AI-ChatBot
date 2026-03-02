import ChatsClientLayout from "./clientLayout";

export default async function ChatsLayout({ children }: { children: React.ReactNode }) {
  return <ChatsClientLayout>{children}</ChatsClientLayout>;
}
