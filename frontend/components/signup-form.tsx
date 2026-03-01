"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";
import { register } from "@/lib/apiFun/auth";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupSchema } from "@/lib/schemas/auth.schema";
import { useState } from "react";
import Link from "next/link";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [serverSrror, setServerError] = useState<string | null>(null);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupSchema) {
    try {
      setServerError(null);

      await register(data.username, data.email, data.password);
      router.push("/login");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Registration failed";

      setServerError(message);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Name */}
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input {...formRegister("username")} placeholder="John Doe" />
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input {...formRegister("email")} type="email" placeholder="m@example.com" />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </Field>

              {/* Passwords */}
              <Field className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input {...formRegister("password")} type="password" />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </Field>

                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input {...formRegister("confirmPassword")} type="password" />
                </Field>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </Field>

              <FieldDescription>Must be at least 8 characters long.</FieldDescription>

              {/* Submit */}
              <Field>
                <Button type="submit" disabled={isSubmitting} className="text-black cursor-pointer">
                  {isSubmitting ? <Spinner /> : "Create Account"}
                </Button>

                <FieldDescription className="text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>

          {serverSrror && (
            <div className="rounded-md bg-destructive/10 p-3 mt-4">
              <p className="text-sm text-destructive">{serverSrror}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">By clicking continue, you agree to our Terms of Service and Privacy Policy.</FieldDescription>
    </div>
  );
}
