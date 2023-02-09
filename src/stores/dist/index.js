"use strict";
exports.__esModule = true;
exports.recommendedArray = exports.player = exports.isDev = void 0;
var store_1 = require("svelte/store");
exports.isDev = store_1.writable(process.env.NODE_ENV === "development");
exports.player = store_1.writable(0);
exports.recommendedArray = store_1.writable([]);
