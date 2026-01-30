import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">AI Chatbot</CardTitle>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
