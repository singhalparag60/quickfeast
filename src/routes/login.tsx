import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — QuickFeast" },
      { name: "description", content: "Log in to your QuickFeast account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-xl">
        <h1 className="text-3xl font-extrabold">Log in</h1>
        <p className="mt-2 text-muted-foreground">Authentication is coming in the next release. This is a placeholder page.</p>
        <Button asChild className="mt-6 h-12 w-full rounded-xl"><Link to="/">Back to home</Link></Button>
      </div>
    </div>
  );
}
