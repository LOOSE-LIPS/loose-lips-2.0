export {};
import express from "express";
import SoundCloud from "soundcloud-scraper";
import fs from "fs";
const api = express();
const host = "localhost";
const PORT = 8080;

const client = new SoundCloud.Client();

let urls = [
  "https://soundcloud.com/loose-lips123/loose-lips-mix-series-306-ukaea",
  "https://soundcloud.com/loose-lips123/loose-lips-mix-series-411-ty-lumnus",
  "https://soundcloud.com/loose-lips123/loose-lips-mix-series-410-highrise",
  "https://soundcloud.com/loose-lips123/loose-lips-mix-series-409-molly-riann",
  "https://soundcloud.com/loose-lips123/loose-lips-mix-series-407-cersy",
  "https://soundcloud.com/loose-lips123/loose-lips-mix-series-408-chantz-lish",
  "https://soundcloud.com/loose-lips123/loose-lips-mix-series-244-bonasforsa",
  "https://soundcloud.com/loose-lips123/loose-lips-mix-series-406-matt-jn",
  "https://soundcloud.com/loose-lips123/loose-lips-mix-series-401-gravitational-effect",
];

export async function getsoundCloudData(url: any) {
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
    .catch(console.error);
}

let data = [];

urls.forEach((url) => {
  getsoundCloudData(url).then((res) => {
    data.push(res);
    fs.appendFile("./data.json", JSON.stringify(res, null, 2), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
});

/////WRITE TO SERVER//////
api.get("/", (req, res) => {
  res.send("API test");
});

api.get("/soundcloudData", (req, res) => {
  res.send(data);
});

api.listen(PORT, () => {
  console.log("API listening on port 8080");
});
