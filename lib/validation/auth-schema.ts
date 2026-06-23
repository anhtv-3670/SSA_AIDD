import { z } from "zod";

/** Login form schema. Validated server-side before any Supabase call. */
export const loginSchema = z.object({
  // Trim BEFORE the email check: in zod v4 a trailing-whitespace email would
  // otherwise fail validation instead of being normalized.
  email: z.string().trim().pipe(z.email({ error: "Email không hợp lệ." })),
  password: z.string().min(1, { error: "Vui lòng nhập mật khẩu." }),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Result returned by the login Server Action to drive `useActionState`. */
export type LoginFormState =
  | {
      /** General (non-field) error message shown above the form. */
      error?: string;
      /** Per-field validation messages. */
      fieldErrors?: { email?: string[]; password?: string[] };
      /** Echoes the submitted email so it survives a failed attempt. */
      email?: string;
    }
  | undefined;
