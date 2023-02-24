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
    url: `https://loose-lips.seedpip.com/wp-json/wp/v2/mix?page=${i}`,
    method: "get",
    parse: "json",
    headers: {
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
  })
    .then((response) => response.body)
    .then(async (data) => {
      data.forEach((mix) => {
        if (mix.slug) {
          getsoundCloudData(`https://soundcloud.com/loose-lips123/${mix.slug}`)
            .then((res) => {
              const tags = res.tags ? res.tags : "";
              const imageData = mix.yoast_head_json.og_image;
              let outputPaths = [];
              if (imageData) {
                const imgDirectory = `../static/imported/${mix.slug}`;

                if (!fs.existsSync(imgDirectory)) {
                  fs.mkdirSync(imgDirectory, { recursive: true });
                }
                imageData.forEach((data) => {
                  let imageUrl = data.url;
                  let outputPath = path.join(
                    imgDirectory,
                    `/image${mix.id}.jpeg`
                  );
                  outputPaths.push(outputPath);
                  const username = "seedpipdev";
                  const password = "ThisIsAPassword";
                  const options = {
                    headers: {
                      Authorization:
                        "Basic " +
                        Buffer.from(username + ":" + password).toString(
                          "base64"
                        ),
                    },
                  };
                  https.get(imageUrl, options, (res) => {
                    const fileStream = fs.createWriteStream(outputPath);
                    res.pipe(fileStream);
                  });
                });
              }

              const regex = /^(\d{4})-(\d{2})-(\d{2}).*/;
              const match = regex.exec(mix.date);
              const transformedDateString =
                match[1] + "-" + match[2] + "-" + match[3];

              const data = {
                id: res.id,
                date: transformedDateString,
                title: mix.yoast_head_json.title,
                type: mix.type,
                slug: mix.slug,
                author: mix.author,
                banner: outputPaths,
                description: mix.yoast_head_json.og_description,
                published: true,
                tags: tags,
                //   secondTags: res.tags,
              };
              const turndownService = new TurndownService();
              const markdownString = turndownService.turndown(
                mix.content.rendered
              );
              const yamlData = yaml.safeDump(data);

              const folderDirectory = path.join(
                rootDir,
                `src/routes/markdownfiles/importMixes/${mix.slug}`
              );

              if (!fs.existsSync(folderDirectory)) {
                fs.mkdirSync(folderDirectory, { recursive: true });
              }
              console.log(`writing to: ${folderDirectory}`);
              fs.writeFileSync(
                path.join(folderDirectory, "index.md"),
                "---\n" + yamlData.trim() + "\n---\n"
              );

              console.log(res.tags);
            })
            .catch(() => {
              null;
            });
        }
      });
    });
}
