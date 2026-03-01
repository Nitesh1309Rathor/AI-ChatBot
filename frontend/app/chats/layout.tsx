import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChatsClientLayout from "./clientLayout";

export default async function ChatsLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  console.log(token);

  // if (!token) {
  //   redirect("/login");
  // }

  return <ChatsClientLayout>{children}</ChatsClientLayout>;
}
