import yaml from "js-yaml";
import fs from "fs";
import TurndownService from "turndown";
import https from "https";
import phin from "phin";
const username = "seedpipdev";
const password = "ThisIsAPassword";
const totalPages = 68;
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
          const directoryPath = `../../static/images/importPosts/${post.slug}`;
          fs.mkdir(directoryPath, (err) => {
            if (err) console.error(err);
          });

          imageData.forEach((data) => {
            let imageUrl = data.url;
            let outputPath = `../../static/images/importPosts/${post.slug}/image${post.id}.jpeg`;
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
          id: post.id,
          date: post.date,
          title: post.yoast_head_json.title,
          type: post.type,
          slug: post.slug,
          author: post.author,
          banner: outputPaths,
          description: post.yoast_head_json.og_description,
          published: true,
          tags: post.tags,
        };
        const turndownService = new TurndownService();
        const markdownString = turndownService.turndown(post.content.rendered);
        const yamlData = yaml.safeDump(data);
        fs.writeFileSync(
          `../routes/markupfiles/posts/${post.slug}.md`,
          "---\n" + yamlData.trim() + "\n---\n" + `${markdownString}`
        );
      });
    });
}
