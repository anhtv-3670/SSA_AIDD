// Intentionally a Server Component (no "use client"): it only renders forms
// whose submit invokes a server action — no client-side interactivity needed.
import { signInWithOAuth } from "./actions";

const PROVIDERS = [
  { id: "google", label: "Tiếp tục với Google" },
  { id: "github", label: "Tiếp tục với GitHub" },
] as const;

/**
 * OAuth provider buttons. Each is a form whose submit invokes the
 * `signInWithOAuth` server action with the chosen provider, which redirects
 * the browser to the provider's authorization page.
 */
export function OAuthButtons() {
  return (
    <div className="flex flex-col gap-3">
      {PROVIDERS.map((provider) => (
        <form key={provider.id} action={signInWithOAuth}>
          <input type="hidden" name="provider" value={provider.id} />
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            {provider.label}
          </button>
        </form>
      ))}
    </div>
  );
}
