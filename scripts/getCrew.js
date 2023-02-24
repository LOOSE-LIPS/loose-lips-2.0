import yaml from "js-yaml";
import fs from "fs";
import TurndownService from "turndown";
import https from "https";
import phin from "phin";
import path from "path";

const username = "seedpipdev";
const password = "ThisIsAPassword";
const totalPages = 3;

const rootDir = process.cwd();

for (let i = 1; i < totalPages; i++) {
  phin({
    url: `https://loose-lips.seedpip.com/wp-json/wp/v2/crew?page=${i}`,
    method: "get",
    parse: "json",
    headers: {
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
  })
    .then((response) => response.body)
    .then((data) => {
      data.forEach((profile) => {
        const imageData = profile.yoast_head_json.og_image;
        let outputPaths = [];
        if (imageData) {
          const imgDirectory = `../static/imported/${profile.slug}`;

          if (!fs.existsSync(imgDirectory)) {
            fs.mkdirSync(imgDirectory, { recursive: true });
          }

          imageData.forEach((data) => {
            let imageUrl = data.url;
            let outputPath = path.join(
              imgDirectory,
              `/image${profile.id}.jpeg`
            );
            outputPaths.push(outputPath);
            const username = "seedpipdev";
            const password = "ThisIsAPassword";
            const options = {
              headers: {
                Authorization:
                  "Basic " +
                  Buffer.from(username + ":" + password).toString("base64"),
              },
            };
            https.get(imageUrl, options, (res) => {
              const fileStream = fs.createWriteStream(outputPath);
              res.pipe(fileStream);
            });
          });
        }

        const regex = /^(\d{4})-(\d{2})-(\d{2}).*/;
        const match = regex.exec(profile.date);
        const transformedDateString =
          match[1] + "-" + match[2] + "-" + match[3];

        const data = {
          id: profile.id,
          date: transformedDateString,
          title: profile.yoast_head_json.title,
          type: profile.type,
          slug: profile.slug,
          author: profile.author,
          banner: outputPaths,
          description: profile.yoast_head_json.og_description,
          published: true,
          tags: ["crew"],
        };

        const turndownService = new TurndownService();
        turndownService.addRule("new rule", {
          filter: "p",
          replacement: function (content) {
            return content.replace(/< online| < illustration| < hand /gi, "");
          },
        });
        const markdownString = turndownService.turndown(
          profile.content.rendered
        );

        const yamlData = yaml.safeDump(data);
        const folderDirectory = path.join(
          rootDir,
          `src/routes/markdownfiles/importCrew/${profile.slug}`
        );

        if (!fs.existsSync(folderDirectory)) {
          fs.mkdirSync(folderDirectory, { recursive: true });
        }
        console.log("writing file to", path.join(folderDirectory, "index.md"));
        fs.writeFileSync(
          path.join(folderDirectory, "index.md"),
          "---\n" + yamlData.trim() + "\n---\n" + `${markdownString}`
        );
      });
    });
}
