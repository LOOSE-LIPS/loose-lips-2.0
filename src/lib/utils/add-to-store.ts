import { recommendedArray } from "../../stores";
import type { IBlog } from "$models/interfaces/iblog.interface";
import type { IEventsCard } from "$models/interfaces/ievents-card.interface";

export const addToStore = (post: IBlog | IEventsCard) => {
  post.tags.forEach((tag: string) => {
    recommendedArray.update((prevArray) => {
      return prevArray.includes(tag) ? prevArray : [...prevArray, tag];
    });
  });
  recommendedArray.subscribe((data) => {
    console.log(data);
  });
};
