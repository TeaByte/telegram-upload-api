/// <reference lib="deno.unstable" />
import { cuid } from "https://deno.land/x/cuid@v1.0.0/index.js";
import config from "./config.ts";

type recordId = string;
interface dbRecord {
  fileName: string;
  fileId: string;
  fileSize: number;
}

Deno.env.set("DENO_KV_ACCESS_TOKEN", config["kvToken"]);
const kv = await Deno.openKv(config["denoKV"]);

export async function set(
  fileName: string,
  fileId: string,
  fileSize: number
): Promise<recordId> {
  const id = cuid();
  await kv.set(["uploads", id], {
    fileName,
    fileId,
    fileSize,
  });
  return id;
}

export async function get(id: recordId): Promise<dbRecord> {
  return (await kv.get(["uploads", id])).value as dbRecord;
}
