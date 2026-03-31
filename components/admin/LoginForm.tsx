"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/shared/Button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl
    });

    if (result?.error) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form className="mx-auto mt-14 max-w-md rounded-2xl border border-app-border bg-app-surface/80 p-6" onSubmit={onSubmit}>
      <p className="accent-label text-[11px] text-app-primary">Admin</p>
      <h1 className="mt-2 text-4xl">Sign in</h1>
      <p className="mt-1 text-sm text-app-text-muted">Use your admin credentials to manage orders and tables.</p>

      <div className="mt-5 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-app-text-muted">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-h-11 w-full rounded-xl border border-app-border bg-app-bg px-3 outline-none focus:border-app-primary"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-app-text-muted">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-11 w-full rounded-xl border border-app-border bg-app-bg px-3 outline-none focus:border-app-primary"
          />
        </label>
      </div>

      {error ? <p className="mt-3 text-sm text-app-danger">{error}</p> : null}

      <Button className="mt-5 w-full" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
