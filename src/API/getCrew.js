import yaml from "js-yaml";
import fs from "fs";
import TurndownService from "turndown";
import https from "https";
import phin from "phin";
const username = "seedpipdev";
const password = "ThisIsAPassword";
const totalPages = 3;
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
          const directoryPath = `../../static/images/importCrew/${profile.slug}`;
          fs.mkdir(directoryPath, (err) => {
            if (err) console.error(err);
          });

          imageData.forEach((data) => {
            let imageUrl = data.url;
            let outputPath = `../../static/images/importCrew/${profile.slug}/image${profile.id}.jpeg`;
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
          id: profile.id,
          date: profile.date,
          title: profile.yoast_head_json.title,
          type: profile.type,
          slug: profile.slug,
          author: profile.author,
          banner: outputPaths,
          description: profile.yoast_head_json.og_description,
          published: true,
          tags: ["crew"],
        };

        console.log(data);
        const turndownService = new TurndownService();
        const markdownString = turndownService.turndown(
          profile.content.rendered
        );
        const test = turndownService.turndown("<h1>info coming soon...</h1>");
        const yamlData = yaml.safeDump(data);
        const folderDirectory = `../routes/markdownfiles/importCrew/${profile.slug}`;
        fs.mkdir(folderDirectory, (err) => {
          if (err) return null;
          else {
            fs.writeFileSync(
              `../routes/markdownfiles/importCrew/${profile.slug}/index.md`,
              "---\n" + yamlData.trim() + "\n---\n"
            );
          }
        });
      });
    });
}
