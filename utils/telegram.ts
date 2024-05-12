import { Client } from "mtkruto";
import config from "./config.ts";

export const client = new Client({
  apiHash: config.apiHash,
  apiId: config.apiId,
});

const onError = (error: unknown) => {
  console.error("Failed to start client", error);
  Deno.exit(1);
};

await client.start({ botToken: config.botToken }).catch(onError);
const me = await client.getMe().catch(onError);
console.log(`Runing as ${me.username}`);

export async function uploadToTelegram(file: File) {
  const fileContent = new Uint8Array(await file.arrayBuffer());
  const rFile = await client.sendDocument(config["chatId"], fileContent, {
    fileName: file.name,
    mimeType: file.type,
  });

  return rFile.document.fileId;
}

export async function fetchFromTelegram(fileId: string): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];

  for await (const chunk of client.download(fileId, {
    chunkSize: 512 * 1024,
  })) {
    chunks.push(chunk);
  }

  return chunks.reduce((acc, chunk) => {
    const newAcc = new Uint8Array(acc.length + chunk.length);
    newAcc.set(acc, 0);
    newAcc.set(chunk, acc.length);
    return newAcc;
  }, new Uint8Array());
}
