import { signOut } from "@/app/login/actions";

/**
 * Sign-out control. A form whose submit invokes the shared `signOut` server
 * action (reused from the login feature), which ends the session and redirects
 * to /login. No client interactivity needed, so this stays a Server Component.
 */
export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        Đăng xuất
      </button>
    </form>
  );
}
