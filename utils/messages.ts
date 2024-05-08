import { Context } from "https://deno.land/x/hono@v4.0.8/mod.ts";

export function errorResponse(c: Context, errorMessage: string) {
  c.json(
    {
      error: errorMessage,
    },
    400
  );
}
