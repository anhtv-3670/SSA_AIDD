"use client";

import { useActionState } from "react";

import { signInWithPassword } from "./actions";
import type { LoginFormState } from "@/lib/validation/auth-schema";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-100";
const labelClass =
  "mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300";
const fieldErrorClass = "mt-1 text-xs text-red-600 dark:text-red-400";

export function LoginForm({ generalError }: { generalError?: string }) {
  const [state, action, pending] = useActionState<LoginFormState, FormData>(
    signInWithPassword,
    undefined,
  );

  const emailError = state?.fieldErrors?.email?.[0];
  const passwordError = state?.fieldErrors?.password?.[0];
  const formError = state?.error ?? generalError;

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      {formError ? (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {formError}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.email ?? ""}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "email-error" : undefined}
          className={fieldClass}
          placeholder="you@example.com"
        />
        {emailError ? (
          <p id="email-error" aria-live="polite" className={fieldErrorClass}>
            {emailError}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={passwordError ? true : undefined}
          aria-describedby={passwordError ? "password-error" : undefined}
          className={fieldClass}
        />
        {passwordError ? (
          <p id="password-error" aria-live="polite" className={fieldErrorClass}>
            {passwordError}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}
