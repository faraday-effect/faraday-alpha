const fs = require("fs");
const path = require("path");

/**
 * Read all schema files in a directory
 * @param dir - directory to read
 * @returns {Array} of strings containing file content
 */
function readAllSchemata(dir) {
  let schemata = [];

  fs.readdirSync(dir).map(entry => {
    if (entry.endsWith(".graphql")) {
      schemata.push(fs.readFileSync(path.join(dir, entry), "utf-8"));
    }
  });

  return schemata;
}

module.exports = readAllSchemata(__dirname);
