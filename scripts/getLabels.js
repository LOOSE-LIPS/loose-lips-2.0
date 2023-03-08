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
    url: `https://loose-lips.seedpip.com/wp-json/wp/v2/label?page=${i}`,
    method: "get",
    parse: "json",
    headers: {
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
  })
    .then((response) => response.body)
    .then((data) => {
      data.map(async (label) => {
        const imageData = label?.yoast_head_json?.og_image || [];

        const imgDirectory = path.join(
          rootDir,
          `static/imported/${label.slug}`
        );
        if (!fs.existsSync(imgDirectory)) {
          fs.mkdirSync(imgDirectory, { recursive: true });
        }

        const images = await Promise.all(
          imageData.map((x) => {
            const output = path.join(imgDirectory, `/image${label.id}.jpeg`);
            return downloadImageTo(x.url, output).then(() =>
              path.relative(path.join(rootDir, "static"), output)
            );
          })
        );

        const regex = /^(\d{4})-(\d{2})-(\d{2}).*/;
        const match = regex.exec(label.date);
        const transformedDateString =
          match[1] + "-" + match[2] + "-" + match[3];
        let featured = false;
        if (label.id === 1211 || label.id === 1378) {
          featured = true;
        } else {
          featured = false;
        }

        const urlForTag = label.link;
        const extract = urlForTag.split("/")[3];
        console.log(extract, "extract"); // Output: "release-review"

        const data = {
          id: label.id,
          date: transformedDateString,
          title: label.yoast_head_json.title,
          type: label.type,
          slug: label.slug,
          author: label.author,
          banner: images,
          description: label.yoast_head_json.og_description,
          published: true,
          tags: extract,
          featured: featured,
        };

        const turndownService = new TurndownService({});
        const markdownString = turndownService.turndown(
          `${label.content.rendered}`
        );
        const imgHtml = `<img src=../${images[0]} alt="image"></img>`;
        const imgMd = turndownService.turndown(imgHtml);
        const yamlData = yaml.safeDump(data);

        const folderDirectory = path.join(
          rootDir,
          `src/routes/labels/${label.slug}`
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

const downloadImageTo = (url, dest) =>
  new Promise((resolve, reject) => {
    const username = "seedpipdev";
    const password = "ThisIsAPassword";
    const options = {
      headers: {
        Authorization:
          "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      },
    };
    https.get(url, options, (res) => {
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      res.on("end", () => resolve());
      res.on("error", reject);
    });
  });
