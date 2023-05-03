import yaml from "js-yaml";
import fs from "fs";
import TurndownService from "turndown";
import https from "https";
import phin from "phin";
import path from "path";
import SoundCloud from "soundcloud-scraper";
import axios from "axios";
import { load } from "cheerio";
const client = new SoundCloud.Client();
const username = "seedpipdev";
const password = "ThisIsAPassword";
const totalPages = 16;
const rootDir = process.cwd();

async function getSoundcloudLink(url, username, password) {
  const auth = { username: username, password: password };
  const response = await axios.get(url, { auth });
  const $ = load(response.data);
  const content = $(".site-main iframe").attr("src");
  const urlWithOptions = new URL(content).searchParams.get("url");
  const pattern = /\?.*/;
  const soundCloudLink = urlWithOptions.replace(pattern, "");
  return soundCloudLink;
}

async function getIframeLink(url, username, password) {
  const auth = { username: username, password: password };
  const response = await axios.get(url, { auth });
  const $ = load(response.data);
  const link = $(".site-main iframe").attr("src");
  return link;
}

export async function getsoundCloudData(url) {
  return client
    .getSongInfo(url)
    .then(async (song) => {
      if (song != undefined) {
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
      }
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
        const url = show.link;
        const soundCloudlink = await getSoundcloudLink(url, username, password);

        await getsoundCloudData(soundCloudlink).then(async (res) => {
          const tags = res.tags ? res.tags : "";

          const iframeLink = await getIframeLink(url, username, password);
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
              const output = path.join(imgDirectory, `/image${show.id}.jpeg`);
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
            soundCloudUrl: soundCloudlink,
            iframeLink: iframeLink,
            id: show.id,
            date: transformedDateString,
            title: show.yoast_head_json.title,
            type: show.type,
            slug: show.slug,
            author: show.author,
            banner: images,
            description: show.yoast_head_json.og_description,
            published: true,
            tags: tags,
          };
          const turndownService = new TurndownService();
          turndownService.keep(["iframe"]);
          const widget = `<iframe id="sc-widget"
          title="title"
          width="100"
          height="160"
          scrolling="no"
          frameborder="yes"
          allow="autoplay"
          src=${iframeLink}></iframe>`;

          const widgetMarkdown = turndownService.turndown(widget);
          const markdownString = turndownService.turndown(
            show.content.rendered
          );

          const yamlData = yaml.safeDump(data);
          const folderDirectory = path.join(
            rootDir,
            `src/routes/radio-shows/${show.slug}`
          );
          if (!fs.existsSync(folderDirectory)) {
            fs.mkdirSync(folderDirectory, { recursive: true });
          }

          fs.writeFileSync(
            path.join(folderDirectory, "index.md"),
            "---\n" +
              yamlData.trim() +
              "\n---\n" +
              widgetMarkdown +
              "\n---\n" +
              markdownString
          );
        });
      });
    })
    .catch((e) => {
      return null;
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
