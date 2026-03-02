import { SignupForm } from "@/components/signup-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  console.log(token);

  if (token) {
    redirect("/chats");
  }
  return (
    <div className=" flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 ">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignupForm />
      </div>
    </div>
  );
}
