"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Card, ErrorBanner, Input, Label } from "@/components/ui";
import { confirmSignUp, login, resendCode, signUp } from "@/lib/account";

type Step = "details" | "confirm";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function onDetails(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signUp(email, password, name);
      setInfo(`We sent a verification code to ${email}.`);
      setStep("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  async function onConfirm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await confirmSignUp(email, code.trim());
      // Auto sign-in after confirmation, then onboard happens server-side.
      await login(email, password);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirmation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4">
      <Card>
        {step === "details" ? (
          <>
            <h1 className="mb-1 text-xl font-semibold tracking-tight">Create your account</h1>
            <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
              Get an API key and start parsing résumés.
            </p>
            <form onSubmit={onDetails} className="space-y-4">
              <div>
                <Label>Company name</Label>
                <Input value={name} placeholder="Acme Corp" onChange={(e) => setName(e.target.value)} autoFocus required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              {error && <ErrorBanner message={error} />}
              <Button type="submit" loading={loading} className="w-full">
                Create account
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mb-1 text-xl font-semibold tracking-tight">Verify your email</h1>
            {info && <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">{info}</p>}
            <form onSubmit={onConfirm} className="space-y-4">
              <div>
                <Label>Verification code</Label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} autoFocus required />
              </div>
              {error && <ErrorBanner message={error} />}
              <Button type="submit" loading={loading} className="w-full">
                Verify &amp; continue
              </Button>
            </form>
            <button
              type="button"
              onClick={async () => {
                setError("");
                try {
                  await resendCode(email);
                  setInfo(`A new code was sent to ${email}.`);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Could not resend code");
                }
              }}
              className="mt-4 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Resend code
            </button>
          </>
        )}
        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
