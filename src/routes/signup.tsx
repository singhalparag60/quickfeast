import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowLeft, Lock, Mail, User } from "lucide-react";

import { QuickFeastLogo } from "@/components/quickfeast-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidGmail, registerUser } from "@/lib/prototype-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — QuickFeast" },
      { name: "description", content: "Create a QuickFeast account to get your favorite food fast and hot." },
      { property: "og:title", content: "Sign up — QuickFeast" },
      { property: "og:description", content: "Create a QuickFeast account to get your favorite food fast and hot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [formError, setFormError] = useState("");

  const [loading, setLoading] = useState(false);

  function validate() {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");
    setFormError("");

    if (!fullName.trim()) {
      setNameError("Full name is required.");
      valid = false;
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setEmailError("Email address is required.");
      valid = false;
    } else if (!isValidGmail(trimmedEmail)) {
      setEmailError("Email must end with @gmail.com (e.g. user@gmail.com).");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmError("Please confirm your password.");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      valid = false;
    }

    return valid;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = registerUser({
      name: fullName,
      email,
      password,
    });

    if (!result.success) {
      setLoading(false);
      setFormError(result.error);
      return;
    }

    // Success -> redirect to /home
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
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Create account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Join QuickFeast for fast and delicious food delivery</p>
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
              <Label htmlFor="signup-name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (nameError) setNameError("");
                    if (formError) setFormError("");
                  }}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? "signup-name-error" : undefined}
                  className="h-11 pl-10"
                />
              </div>
              {nameError && (
                <p id="signup-name-error" className="text-xs font-medium text-destructive">
                  {nameError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="signup-email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-email"
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
                  aria-describedby={emailError ? "signup-email-error" : undefined}
                  className="h-11 pl-10"
                />
              </div>
              {emailError && (
                <p id="signup-email-error" className="text-xs font-medium text-destructive">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                    if (formError) setFormError("");
                  }}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={passwordError ? "signup-password-error" : undefined}
                  className="h-11 pl-10"
                />
              </div>
              {passwordError && (
                <p id="signup-password-error" className="text-xs font-medium text-destructive">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="signup-confirm-password">Confirm password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmError) setConfirmError("");
                    if (formError) setFormError("");
                  }}
                  aria-invalid={Boolean(confirmError)}
                  aria-describedby={confirmError ? "signup-confirm-error" : undefined}
                  className="h-11 pl-10"
                />
              </div>
              {confirmError && (
                <p id="signup-confirm-error" className="text-xs font-medium text-destructive">
                  {confirmError}
                </p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="mt-2 h-11 w-full rounded-xl text-base font-semibold">
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
