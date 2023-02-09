import { writable } from "svelte/store";
import type { INowPlayingTrack } from "$models/interfaces/inow-playing-track.interface";
import type { IBlog } from "$models/interfaces/iblog.interface";
import type { IEventsCard } from "$models/interfaces/ievents-card.interface";

export const isDev = writable(process.env.NODE_ENV === "development");

export const player = writable(0);
export const recommendedArray = writable([]);
