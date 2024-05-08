export function isSizeAcceptable(fileSize: number) {
  if (fileSize === 0 || fileSize > 2000000000) return false;
  return true;
}
