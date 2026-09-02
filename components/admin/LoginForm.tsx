"use client";

import { useActionState } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const initial: LoginState = { error: "" };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="mt-9 space-y-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label
          htmlFor="password"
          className="mb-2 block font-mono text-label uppercase text-ink-soft"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
          className="w-full rounded-sheet border border-ink/20 bg-paper px-3 py-2.5 text-small text-ink transition-colors duration-150 hover:border-ink/35 focus:border-pen focus:outline-none"
        />
      </div>

      <div aria-live="polite">
        {state.error ? (
          <p id="login-error" className="flex items-start gap-2 text-small text-pen">
            <CircleAlert size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span>{state.error}</span>
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-sheet bg-ink px-5 py-3 font-mono text-micro uppercase tracking-[0.16em] text-paper transition-colors duration-200 hover:bg-ink-soft disabled:opacity-50"
      >
        {pending ? (
          <LoaderCircle size={14} aria-hidden="true" className="animate-spin" />
        ) : null}
        {pending ? "Checking" : "Sign in"}
      </button>
    </form>
  );
}
