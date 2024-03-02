import {
  Client,
  StorageLocalStorage,
} from "https://deno.land/x/mtkruto@0.1.155/mod.ts";

import config from "./config.ts";

export const client = new Client(
  new StorageLocalStorage("client"),
  parseInt(config["apiId"]),
  config["apiHash"]
);

await client.start(config["botToken"]).catch((error) => {
  console.error("Failed to start client", error);
  Deno.exit(1);
});

try {
  const me = await client.getMe();
  console.log(`Runing as ${me.username}`);
} catch {
  console.error(
    "Failed to fetch bot info. make sure the bot token is valid and apiId and apiHash are correct"
  );
  Deno.exit(1);
}

export async function uploadToTelegram(path: string) {
  const file = await client.sendDocument(config["chatId"], path);
  return file.document.fileId;
}

export async function fetchFromTelegram(fileId: string, fileName: string) {
  const path = `./temp/${fileName}`;
  const outFile = await Deno.open(path, {
    write: true,
    create: true,
    truncate: true,
  });
  try {
    for await (const chunk of client.download(fileId, {
      chunkSize: 256 * 1024,
    })) {
      await Deno.write(outFile.rid, chunk);
    }
  } finally {
    await Deno.close(outFile.rid);
  }
  return path;
}
