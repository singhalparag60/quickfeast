import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — QuickFeast" },
      { name: "description", content: "Create a QuickFeast account to get your favorite food fast and hot." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-xl">
        <h1 className="text-3xl font-extrabold">Sign up</h1>
        <p className="mt-2 text-muted-foreground">Authentication is coming in the next release. This is a placeholder page.</p>
        <Button asChild className="mt-6 h-12 w-full rounded-xl"><Link to="/">Back to home</Link></Button>
      </div>
    </div>
  );
}
