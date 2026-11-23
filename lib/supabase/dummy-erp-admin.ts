import { createClient } from "@supabase/supabase-js";

import "server-only";
export const dummyErpAdmin = createClient(
  process.env.DUMMY_ERP_SUPABASE_URL!,
  process.env.DUMMY_ERP_SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);