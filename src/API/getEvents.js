import yaml from "js-yaml";
import fs from "fs";
import TurndownService from "turndown";
import https from "https";
import phin from "phin";
const username = "seedpipdev";
const password = "ThisIsAPassword";
const totalPages = 8;
for (let i = 1; i < totalPages; i++) {
  phin({
    url: `https://loose-lips.seedpip.com/wp-json/wp/v2/event?page=${i}`,
    method: "get",
    parse: "json",
    headers: {
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
  })
    .then((response) => response.body)
    .then((data) => {
      data.forEach((event) => {
        const imageData = event.yoast_head_json.og_image;
        let outputPaths = [];
        if (imageData) {
          const directoryPath = `../../static/images/importEvents/${event.slug}`;
          fs.mkdir(directoryPath, (err) => {
            if (err) console.error(err);
          });

          imageData.forEach((data) => {
            let imageUrl = data.url;
            let outputPath = `../../static/images/importEvents/${event.slug}/image${event.id}.jpeg`;
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

        const data = {
          id: event.id,
          date: event.date,
          title: event.yoast_head_json.title,
          type: event.type,
          slug: event.slug,
          author: event.author,
          banner: outputPaths,
          description: event.yoast_head_json.og_description,
          published: true,
          tags: ["event"],
        };

        console.log(data);
        const turndownService = new TurndownService();
        const markdownString = turndownService.turndown(event.content.rendered);
        const test = turndownService.turndown(
          "<h1>content coming soon...</h1>"
        );
        const yamlData = yaml.safeDump(data);
        const folderDirectory = `../routes/markdownfiles/importEvents/${event.slug}`;

        fs.mkdir(folderDirectory, (err) => {
          if (err) return null;
          else {
            fs.writeFileSync(
              `../routes/markdownfiles/importEvents/${event.slug}/index.md`,
              "---\n" + yamlData.trim() + "\n---\n" + `${test}`
            );
          }
        });
      });
    });
}
