const yaml = require("js-yaml");
const fs = require("fs");
const jsonData = JSON.parse(fs.readFileSync("posts.json"));
const yamlData = yaml.safeDump(jsonData);
fs.writeFileSync("data.md", "---\n" + yamlData.trim() + "\n---\n");
console.log("YAML data written to data.md");
