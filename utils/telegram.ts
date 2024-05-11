import { Client, StorageLocalStorage } from "mtkruto";
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

export async function uploadToTelegram(uint8Array: Uint8Array) {
  const file = await client.sendDocument(config["chatId"], uint8Array);
  return file.document.fileId;
}

export async function fetchFromTelegram(fileId: string): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  try {
    for await (const chunk of client.download(fileId, {
      chunkSize: 256 * 1024,
    })) {
      chunks.push(chunk);
    }
    return chunks.reduce((acc, chunk) => {
      const newAcc = new Uint8Array(acc.length + chunk.length);
      newAcc.set(acc, 0);
      newAcc.set(chunk, acc.length);
      return newAcc;
    }, new Uint8Array());
  } catch {
    throw new Error("Error fetching from Telegram");
  }
}
