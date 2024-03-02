import { Hono, Context } from "https://deno.land/x/hono@v4.0.8/mod.ts";

import * as db from "./database.ts";
import { fetchFromTelegram, uploadToTelegram } from "./telegram.ts";
import { saveToSystem, deleteFromSystem } from "./system.ts";
import config from "./config.ts";

const app = new Hono();

app.post("/upload", async (c: Context) => {
  const body = await c.req.parseBody();
  const file = body["file"];
  if (file instanceof File) {
    try {
      if (file.size === 0 || file.size > 2000000000) {
        return c.json(
          {
            message: "File size is too large or empty",
          },
          400
        );
      }
      const savedPath = await saveToSystem(
        new Uint8Array(await file.arrayBuffer()),
        file.name
      );
      const fileId = await uploadToTelegram(savedPath);
      await deleteFromSystem(savedPath);
      const recordId = await db.set(file.name, fileId, file.size);
      return c.json(
        {
          message: "File uploaded successfully",
          recordId,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "Failed to upload the file",
        },
        500
      );
    }
  } else {
    return c.json(
      {
        message: "Missing or invalid file",
      },
      400
    );
  }
});

app.post("/fetch", async (c: Context) => {
  const body = await c.req.json();
  const recordId = body["recordId"];
  if (recordId) {
    try {
      const dbData = await db.get(recordId);
      if (!dbData) {
        return c.json(
          {
            message: "File not found",
          },
          404
        );
      }
      const path = await fetchFromTelegram(
        dbData["fileId"],
        dbData["fileName"]
      );
      const file = await Deno.readFile(path);
      await deleteFromSystem(path);
      return c.body(file.buffer, 200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${dbData["fileName"]}"`,
      });
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "Failed to download the file",
        },
        500
      );
    }
  } else {
    return c.json(
      {
        message: "File ID is required",
      },
      400
    );
  }
});

Deno.serve({ port: config["serverPort"] }, app.fetch);
