import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowLeft, Lock, Mail } from "lucide-react";

import { QuickFeastLogo } from "@/components/quickfeast-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidGmail, loginUser } from "@/lib/prototype-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — QuickFeast" },
      { name: "description", content: "Log in to your QuickFeast account." },
      { property: "og:title", content: "Log in — QuickFeast" },
      { property: "og:description", content: "Log in to your QuickFeast account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const [loading, setLoading] = useState(false);

  function validate() {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setFormError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setEmailError("Gmail address is required.");
      valid = false;
    } else if (!isValidGmail(trimmedEmail)) {
      setEmailError("Only @gmail.com addresses are allowed (e.g. user@gmail.com).");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    return valid;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = loginUser({ email, password });

    if (!result.success) {
      setLoading(false);
      setFormError(result.error);
      return;
    }

    // Success -> navigate to /home
    navigate({ to: "/home" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-opacity duration-200">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-2" aria-label="QuickFeast Home">
            <QuickFeastLogo className="h-12 w-auto" />
          </Link>
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Link to="/">
              <ArrowLeft className="size-4" />
              <span>Back to home</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-3xl border border-border bg-card p-7 sm:p-9 text-card-foreground shadow-xl">
          <div className="text-center">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Log in to your QuickFeast account to continue</p>
          </div>

          {formError && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive"
            >
              <AlertCircle className="size-5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Gmail address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                    if (formError) setFormError("");
                  }}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? "login-email-error" : undefined}
                  className="h-11 pl-10"
                />
              </div>
              {emailError && (
                <p id="login-email-error" className="text-xs font-medium text-destructive">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                    if (formError) setFormError("");
                  }}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={passwordError ? "login-password-error" : undefined}
                  className="h-11 pl-10"
                />
              </div>
              {passwordError && (
                <p id="login-password-error" className="text-xs font-medium text-destructive">
                  {passwordError}
                </p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="mt-2 h-11 w-full rounded-xl text-base font-semibold">
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
