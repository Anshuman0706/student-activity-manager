import type { CookieOptions } from "@supabase/ssr";

export function getSessionCookieOptions(options: CookieOptions): CookieOptions {
  if (options.maxAge === 0) {
    return options;
  }

  const sessionOptions = { ...options };
  delete sessionOptions.expires;
  delete sessionOptions.maxAge;
  return sessionOptions;
}
