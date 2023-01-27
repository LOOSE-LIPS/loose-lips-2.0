export {};

import SoundCloud from "soundcloud-scraper";

const client = new SoundCloud.Client();

const url = "https://soundcloud.com/beckystroke/heat-stroke";

export async function getsoundCloudData(url) {
  return client
    .getSongInfo(url)
    .then(async (song) => {
      console.log(song);
      return {
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

getsoundCloudData(url).then(console.log);
