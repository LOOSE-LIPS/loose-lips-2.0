import yaml from "js-yaml";
import fs from "fs";
import TurndownService from "turndown";
import https from "https";
import phin from "phin";
import path from "path";

const username = "seedpipdev";
const password = "ThisIsAPassword";
const totalPages = 8;

const rootDir = process.cwd();

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
      data.map(async (event) => {
        const imageData = event?.yoast_head_json?.og_image || [];

        const imgDirectory = path.join(
          rootDir,
          `static/imported/${event.slug}`
        );
        if (!fs.existsSync(imgDirectory)) {
          fs.mkdirSync(imgDirectory, { recursive: true });
        }

        const images = await Promise.all(
          imageData.map((x) => {
            const output = path.join(imgDirectory, `/image${event.id}.jpeg`);
            return downloadImageTo(x.url, output).then(() =>
              path.relative(path.join(rootDir, "static"), output)
            );
          })
        );

        const regex = /^(\d{4})-(\d{2})-(\d{2}).*/;
        const match = regex.exec(event.date);
        const transformedDateString =
          match[1] + "-" + match[2] + "-" + match[3];

        const data = {
          id: event.id,
          date: transformedDateString,
          title: event.yoast_head_json.title,
          type: event.type,
          slug: event.slug,
          author: event.author,
          banner: images,
          description: event.yoast_head_json.og_description,
          published: true,
          tags: ["crew"],
        };

        const turndownService = new TurndownService();
        turndownService.addRule("tags", {
          filter: "p",
          replacement: function (content) {
            if (content.includes("FOOTSOLDIER")) {
              return "";
            } else {
              return content.replace(/<<|<>|>>/gi, "");
            }
          },
        });

        const markdownString = turndownService.turndown(event.content.rendered);
        const yamlData = yaml.safeDump(data);

        const folderDirectory = path.join(
          rootDir,
          `src/routes/events/${event.slug}`
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
            `![image](../${images[0]})` +
            "\n---\n" +
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
