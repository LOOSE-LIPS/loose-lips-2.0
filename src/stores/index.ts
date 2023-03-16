import { writable } from "svelte/store";
export const isDev = writable(process.env.NODE_ENV === "development");
export const player = writable(0);
export const currentTrack = writable("");
export const recommendedArray = writable([]);
