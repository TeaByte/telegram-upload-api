export async function saveToSystem(
  arrayBuffer: ArrayBuffer,
  fileName: string
): Promise<string> {
  const path = `./temp/${fileName}`;
  const file = await Deno.open(path, {
    write: true,
    create: true,
    truncate: true,
  });
  await file.write(new Uint8Array(arrayBuffer));
  await file.close();
  return path;
}

export async function deleteFromSystem(path: string) {
  await Deno.remove(path);
}
