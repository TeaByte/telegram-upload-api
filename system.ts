export async function saveToSystem(
  buffer: Uint8Array,
  fileName: string
): Promise<string> {
  const path = `./temp/${fileName}`;
  const file = await Deno.open(path, {
    write: true,
    create: true,
    truncate: true,
  });
  await file.write(buffer);
  await file.close();
  return path;
}

export async function deleteFromSystem(path: string) {
  await Deno.remove(path);
}
