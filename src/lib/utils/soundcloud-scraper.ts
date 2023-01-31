export {};
import express from "express";
import SoundCloud from "soundcloud-scraper";
const api = express();
const host = "localhost";
const PORT = 8080;

const client = new SoundCloud.Client();

const becky = "https://soundcloud.com/beckystroke/heat-stroke";
const ukaea =
  "https://soundcloud.com/loose-lips123/loose-lips-mix-series-306-ukaea";

export async function getsoundCloudData(url: string) {
  return client
    .getSongInfo(url)
    .then(async (song) => {
      return {
        id: song.id,
        title: song.title,
        description: song.description,
        genre: song.genre,
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
getsoundCloudData(ukaea).then((res) => {
  data.push(res);
  console.log(data);
});

api.get("/", (req, res) => {
  res.send("API test");
});

api.get("/soundcloudData", (req, res) => {
  res.send(data);
});

api.listen(PORT, () => {
  console.log("API listening on port 8080");
});
