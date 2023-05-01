import yaml from "js-yaml";
import fs from "fs";
import TurndownService from "turndown";
import https from "https";
import phin from "phin";
import path from "path";
import axios from "axios";
import { load } from "cheerio";
import he from "he";

//&#39
//&#8211
//&rsquo;
//&nbsp;
//&#8217;s

const username = "seedpipdev";
const password = "ThisIsAPassword";
const totalPages = 68;

const rootDir = process.cwd();

async function getIframes(url, username, password) {
  const auth = { username: username, password: password };
  const response = await axios.get(url, { auth }).catch((e) => {
    console.log(`Failed to get`, url);
  });
  if (!response) return [];
  const $ = load(response.data);
  const content = $("iframe");
  const iframes = [];
  content.each((index, x) => {
    iframes.push({
      src: $(x).attr("src") ?? null,
      loading: $(x).attr("loading") ?? null,
      width: $(x).attr("width") ?? null,
      height: $(x).attr("height") ?? null,
      frameborder: $(x).attr("frameborder") ?? null,
      title: $(x).attr("title") ?? null,
      scrolling: $(x).attr("scrolling") ?? "no",
      frameborder: $(x).attr("frameborder") ?? "no",
    });
  });
  return { iframes, url };
}

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
    .then(async (data) => {
      // let iframes = [];
      // for (let i = 0; i < data.length; i++) {
      //   const result = await getIframes(data[i].link, username, password);
      //   iframes.push(...result.iframes);
      // }
      // console.log(iframes);
      // const iframes = await Promise.all(
      //   data.map((post) => getIframes(post.link, username, password))
      // );
      // console.log(iframes);
      return Promise.all(
        data.map(async (post) => {
          // await getIframes(
          //   "https://loose-lips.seedpip.com/picks/wade-watts-10-retro-games-with-actual-great-music",
          //   username,
          //   password
          // )
          //   .then(console.log)
          //   .catch((e) => {
          //     console.log(e);
          //   });
          const imageData = post?.yoast_head_json?.og_image || [];
          const url = post.link;
          const imgDirectory = path.join(
            rootDir,
            `static/imported/${post.slug}`
          );
          if (!fs.existsSync(imgDirectory)) {
            fs.mkdirSync(imgDirectory, { recursive: true });
          }
          const images = await Promise.all(
            imageData.map((x) => {
              const output = path.join(imgDirectory, `/image${post.id}.jpeg`);
              return downloadImageTo(x.url, output).then(() =>
                path.relative(path.join(rootDir, "static"), output)
              );
            })
          );
          const regex = /^(\d{4})-(\d{2})-(\d{2}).*/;
          const match = regex.exec(post.date);
          const transformedDateString =
            match[1] + "-" + match[2] + "-" + match[3];
          let featured = false;
          if (post.id === 1211 || post.id === 1378) {
            featured = true;
          } else {
            featured = false;
          }
          const urlForTag = post.link;
          const extract = urlForTag.split("/")[3];
          // console.log(extract, "extract"); // Output: "release-review"
          let symbolsToReplace = [
            "&#39",
            "&#8211",
            "&rsquo",
            "&nbsp",
            "&#8217",
          ];

          symbolsToReplace.forEach((symbol) => {
            post.content.rendered = post.content.rendered.replace(
              new RegExp(symbol, "g"),
              "'"
            );
          });
          const description = he.decode(post.yoast_head_json.og_description);
          const data = {
            id: post.id,
            date: transformedDateString,
            title: post.yoast_head_json.title,
            type: post.type,
            slug: post.slug,
            author: post.author,
            banner: images,
            description: description,
            published: true,
            tags: extract,
            featured: featured,
            itworked: true,
          };
          const turndownService = new TurndownService({});
          turndownService.addRule("<3", {
            filter: "p",
            replacement: function (content) {
              if (post.id === 812) {
                return "";
              }
              const newContent = content.replace(
                /<3|href|<a =”|evolution/gi,
                ""
              );
              return newContent;
            },
          });

          turndownService.addRule("no Content", {
            filter: "iframe",
            replacement: function (url, target) {
              return `<iframe width='100%' height='300' scrolling='no' frameborder='no' allow='autoplay' src='${target.attributes.src.data}'></iframe>`;
            },
          });
          const markdownString = turndownService.turndown(
            `${post.content.rendered}`
          );
          const imgHtml = `<img src=../${images[0]} alt="image"></img>`;
          const imgMd = turndownService.turndown(imgHtml);
          const yamlData = yaml.dump(data);

          const folderDirectory = path.join(
            rootDir,
            `src/routes/blog/${post.slug}`
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
        })
      ).catch((e) => {
        console.log(e, "error");
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

// I w
