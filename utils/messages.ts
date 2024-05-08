import { Context } from "hono";

export function errorResponse(c: Context, errorMessage: string) {
  return c.json(
    {
      message: errorMessage,
    },
    400
  );
}
