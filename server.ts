import { Hono, Context } from "https://deno.land/x/hono@v4.0.8/mod.ts";

import { uploadToTelegram, fetchFromTelegram } from "./telegram.ts";
import { saveToSystem, deleteFromSystem } from "./system.ts";
import config from "./config.ts";

import { isSizeAcceptable } from "./utils/checkers.ts";
import { errorResponse } from "./utils/messages.ts";

const app = new Hono();

app.post("/upload", async (c: Context) => {
  const body = await c.req.parseBody();
  const file = body["file"];
  if (file instanceof File) {
    try {
      if (!isSizeAcceptable(file.size)) {
        return errorResponse(c, "File size is too large or empty");
      }
      const savedPath = await saveToSystem(
        new Uint8Array(await file.arrayBuffer()),
        file.name
      );
      const fileId = await uploadToTelegram(savedPath);
      await deleteFromSystem(savedPath);
      return c.json(
        {
          message: "File uploaded successfully",
          fileId,
          file,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return errorResponse(c, "Failed to upload the file");
    }
  } else {
    return errorResponse(c, "Missing or invalid file");
  }
});

app.post("/fetch", async (c: Context) => {
  const body = await c.req.json();
  const fileId = body["fileId"];
  if (fileId && typeof fileId == "string") {
    try {
      const [path, fileName] = await fetchFromTelegram(fileId);
      const file = await Deno.readFile(path);
      await deleteFromSystem(path);
      return c.body(file.buffer, 200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      });
    } catch (error) {
      console.error(error);
      return errorResponse(c, "Failed to download the file");
    }
  } else {
    return errorResponse(c, "FileId is missing");
  }
});

Deno.serve({ port: config["serverPort"] }, app.fetch);
