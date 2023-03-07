import yaml from "js-yaml";
import fs from "fs";
import TurndownService from "turndown";
import https from "https";
import phin from "phin";
import path from "path";
import SoundCloud from "soundcloud-scraper";
const client = new SoundCloud.Client();
const username = "seedpipdev";
const password = "ThisIsAPassword";
const totalPages = 16;
const rootDir = process.cwd();

export async function getsoundCloudData(url) {
  return client
    .getSongInfo(url)
    .then(console.log)
    .then(async (song) => {
      console.log(song, "song");
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
        if (show.slug) {
          let url = `https://soundcloud.com/loose-lips123/${show.slug}`;
          try {
            await getsoundCloudData(url).then((res) => {
              const tags = res.tags ? res.tags : "";
              const imageData = show?.yoast_head_json?.og_image || [];
              console.log(tags, "tags");
              console.log(imageData, "imgdata");
              const imgDirectory = path.join(
                rootDir,
                `static/imported/${show.slug}`
              );
              if (!fs.existsSync(imgDirectory)) {
                fs.mkdirSync(imgDirectory, { recursive: true });
              }
            });
          } catch (error) {
            console.log("what is this splitting buisness");
          }
        }
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
