var unified = require("unified");
var stream = require("unified-stream");
var markdown = require("remark-parse");
var remark2rehype = require("remark-rehype");
var html = require("rehype-stringify");
var highlight = require("rehype-highlight");
var doc = require("rehype-document");

var processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(highlight)
  .use(doc)
  .use(html);

process.stdin.pipe(stream(processor)).pipe(process.stdout);
