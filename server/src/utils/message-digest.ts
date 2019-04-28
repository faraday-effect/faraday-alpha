import fs = require("fs");
import md5 = require("md5");

export function hashString(input: string) {
  return md5(input);
}

export function hashFile(path: fs.PathLike) {
  return hashString(fs.readFileSync(path, "utf-8"));
}
