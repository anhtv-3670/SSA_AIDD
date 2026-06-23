import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";
import { OAuthButtons } from "./oauth-buttons";

// NOTE: This UI is PROVISIONAL. Visual values (layout, colors, typography,
// spacing) are placeholders pending reconciliation with the MoMorph design
// (screen GzbNeVGJHz). Do not treat these styles as final.

export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const { error } = await searchParams;
  const generalError =
    error === "oauth"
      ? "Đăng nhập bằng nhà cung cấp thất bại. Vui lòng thử lại."
      : undefined;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Đăng nhập
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Chào mừng trở lại. Vui lòng đăng nhập để tiếp tục.
          </p>
        </div>

        <LoginForm generalError={generalError} />

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-xs uppercase tracking-wide text-zinc-400">
            hoặc
          </span>
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <OAuthButtons />

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Chưa có tài khoản?{" "}
          <Link
            href="/signup"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
