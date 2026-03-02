import { cookies } from "next/headers";
import ChatsClientLayout from "./clientLayout";
import { redirect } from "next/navigation";

export default async function ChatsLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  console.log(token);

  if (!token) {
    redirect("/login");
  }

  return <ChatsClientLayout>{children}</ChatsClientLayout>;
}
