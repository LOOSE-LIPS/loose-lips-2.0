"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.addToStore = void 0;
var stores_1 = require("../../stores");
exports.addToStore = function (post) {
    post.tags.forEach(function (tag) {
        stores_1.recommendedArray.update(function (prevArray) {
            return prevArray.includes(tag) ? prevArray : __spreadArrays(prevArray, [tag]);
        });
    });
    stores_1.recommendedArray.subscribe(function (data) {
        console.log(data);
    });
};
