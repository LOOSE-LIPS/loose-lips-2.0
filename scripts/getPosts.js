import yaml from "js-yaml";
import fs from "fs";
import TurndownService from "turndown";
import https from "https";
import phin from "phin";
import path from "path";
const username = "seedpipdev";
const password = "ThisIsAPassword";
const totalPages = 68;
const rootDir = process.cwd();
for (let i = 1; i < totalPages; i++) {
  phin({
    url: `https://loose-lips.seedpip.com/wp-json/wp/v2/posts?page=${i}`,
    method: "get",
    parse: "json",
    headers: {
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
  })
    .then((response) => response.body)
    .then((data) => {
      data.forEach((post) => {
        const imageData = post.yoast_head_json.og_image;
        let outputPaths = [];
        if (imageData) {
          // const directoryPath = path.join(
          //   rootDir,
          //   `static/imported/${post.slug}`
          // );
          const imgDirectory = `../static/imported/${post.slug}`;
          if (!fs.existsSync(imgDirectory)) {
            fs.mkdirSync(imgDirectory, { recursive: true });
          }

          imageData.forEach((data) => {
            let imageUrl = data.url;
            let outputPath = path.join(imgDirectory, `/image${post.id}.jpeg`);
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
        const match = regex.exec(post.date);
        const transformedDateString =
          match[1] + "-" + match[2] + "-" + match[3];

        const data = {
          id: post.id,
          date: transformedDateString,
          title: post.yoast_head_json.title,
          type: post.type,
          slug: post.slug,
          author: post.author,
          banner: outputPaths,
          description: post.yoast_head_json.og_description,
          published: true,
          tags: post.tags,
        };
        const turndownService = new TurndownService({});
        turndownService.addRule("<3", {
          filter: "p",
          replacement: function (content) {
            const newContent = content.replace(/<3|href|<a =”|evolution/gi, "");
            return newContent;
          },
        });
        turndownService.addRule("no Content", {
          filter: "iframe",
          replacement: function () {
            return "";
          },
        });

        const markdownString = turndownService.turndown(
          `${post.content.rendered}`
        );
        const imgHtml = `<img src=${outputPaths[0]}></img>`;
        const imgMd = turndownService.turndown(imgHtml);
        const yamlData = yaml.safeDump(data);
        const folderDirectory = path.join(
          rootDir,
          `src/routes/markdownfiles/importPosts/${post.slug}`
        );
        if (!fs.existsSync(folderDirectory)) {
          fs.mkdirSync(folderDirectory, { recursive: true });
        }
        console.log(`writing to: ${folderDirectory}`);
        fs.writeFileSync(
          path.join(folderDirectory, "index.md"),
          "---\n" +
            yamlData.trim() +
            "\n---\n" +
            `${imgMd}` +
            `${markdownString}`
        );
      });
    });
}
