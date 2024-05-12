import { Hono, Context } from "hono";
import { cuid } from "cuid";

import config from "./utils/config.ts";
import { uploadToTelegram, fetchFromTelegram } from "./utils/telegram.ts";
import { errorResponse } from "./utils/messages.ts";

const app = new Hono();

app.post("/upload", async (c: Context) => {
  const body = await c.req.parseBody();
  const file = body["file"];

  if (!(file instanceof File)) {
    return errorResponse(c, "Missing or invalid file");
  }
  if (!(file.size && file.size <= 2000000000)) {
    return errorResponse(c, "File size is too large or empty");
  }

  try {
    const fileId = await uploadToTelegram(file);
    return c.json(
      {
        message: "File uploaded successfully",
        fileId,
        file: {
          size: file.size,
          name: file.name,
        },
      },
      200
    );
  } catch (error) {
    console.error(error);
    return errorResponse(c, "Failed to upload the file");
  }
});

app.get("/fetch", async (c: Context) => {
  const fileId = c.req.query("fileId");
  const mainFileName = c.req.query("mainFileName");
  const tempName = cuid();

  if (!(fileId && typeof fileId == "string")) {
    return errorResponse(c, "FileId is missing");
  }

  try {
    const fileData = await fetchFromTelegram(fileId);
    const contentLength = fileData.length;
    return c.body(fileData, 200, {
      "Content-Type": "application/octet-stream",
      "Content-Length": contentLength.toString(),
      "Content-Disposition": `attachment; filename="${
        mainFileName || tempName
      }"`,
    });
  } catch (error) {
    console.error(error);
    return errorResponse(c, "Failed to download the file");
  }
});

Deno.serve({ port: config["serverPort"] }, app.fetch);
