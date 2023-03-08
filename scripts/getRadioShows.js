import yaml from "js-yaml";
import fs from "fs";
import TurndownService from "turndown";
import https from "https";
import phin from "phin";
import path from "path";
import SoundCloud from "soundcloud-scraper";
import { get } from "svelte/store";
const client = new SoundCloud.Client();
const username = "seedpipdev";
const password = "ThisIsAPassword";
const totalPages = 16;
const rootDir = process.cwd();

export async function getsoundCloudData(url) {
  return client
    .getSongInfo(url)
    .then((res) => {
      console.log(res, "res");
    })
    .then(async (song) => {
      return {
        id: song.id,
        title: song.title,
        description: song.description,
        tags: song.genre,
        photo: song.thumbnail,
        author: {
          name: song.author.name,
          username: song.author.username,
          url: song.author.url,
        },
        date: song.publishedAt,
      };
    })
    .catch((e) => {
      console.error(e);
      return Promise.reject(e);
    });
}

for (let i = 1; i < totalPages; i++) {
  phin({
    url: `https://loose-lips.seedpip.com/wp-json/wp/v2/radio?page=${i}`,
    method: "get",
    parse: "json",
    headers: {
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
  })
    .then((response) => response.body)
    .then(async (data) => {
      data.map(async (show) => {
        const url = `https://soundcloud.com/loose-lips123/${show.slug}`;
        if (isUrlValid(url)) {
          await getsoundCloudData(url).then((response) => {
            console.log(response);
          });
          console.log("VALID");
        } else {
          console.log("NOT VALID");

          if (show.slug) {
            await getsoundCloudData(
              `https://soundcloud.com/loose-lips123/${show.slug}`
            ).then(async (res) => {
              console.log(res);
              const tags = res.tags ? res.tags : "";
              const imageData = show?.yoast_head_json?.og_image || [];
              const imgDirectory = path.join(
                rootDir,
                `static/imported/${show.slug}`
              );
              if (!fs.existsSync(imgDirectory)) {
                fs.mkdirSync(imgDirectory, { recursive: true });
              }
              const images = await Promise.all(
                imageData.map((x) => {
                  const output = path.join(
                    imgDirectory,
                    `/image${show.id}.jpeg`
                  );
                  return downloadImageTo(x.url, output).then(() =>
                    path.relative(path.join(rootDir, "static"), output)
                  );
                })
              );
              const regex = /^(\d{4})-(\d{2})-(\d{2}).*/;
              const match = regex.exec(show.date);
              const transformedDateString =
                match[1] + "-" + match[2] + "-" + match[3];
              const data = {
                id: show.id,
                date: transformedDateString,
                title: show.yoast_head_json.title,
                type: show.type,
                slug: show.slug,
                author: show.author,
                banner: images,
                description: show.yoast_head_json.og_description,
                published: true,
                tags: ["radioShow"],
              };
              const turndownService = new TurndownService();
              // const markdownString = turndownService.turndown(mix.content.rendered);
              const yamlData = yaml.safeDump(data);
              const folderDirectory = path.join(
                rootDir,
                `src/routes/radio-shows/${show.slug}`
              );
              if (!fs.existsSync(folderDirectory)) {
                fs.mkdirSync(folderDirectory, { recursive: true });
              }
              console.log(`writing to: ${folderDirectory}`);
              fs.writeFileSync(
                path.join(folderDirectory, "index.md"),
                "---\n" + yamlData.trim() + "\n---\n"
              ).catch(() => {
                null;
              });
            });
          }
        }
      });
    });
}

async function isUrlValid(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
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
