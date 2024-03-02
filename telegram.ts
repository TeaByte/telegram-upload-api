import {
  Client,
  StorageLocalStorage,
} from "https://deno.land/x/mtkruto@0.1.155/mod.ts";

import config from "./config.ts";

export const client = new Client(
  new StorageLocalStorage("client"),
  config["apiId"],
  config["apiHash"]
);

await client
  .start(config["botToken"])
  .catch((error) => console.error("Failed to start client", error));

try {
  const me = await client.getMe();
  console.log(me);
} catch {
  console.error(
    "Failed to get me make sure the bot token is valid and apiId and apiHash are correct"
  );
}

export async function uploadToTelegram(path: string) {
  const file = await client.sendDocument(config["chatId"], path);
  return file.document.fileId;
}

export async function getFromTelegram(fileId: string, fileName: string) {
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
