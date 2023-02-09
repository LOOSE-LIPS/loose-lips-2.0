"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.get = void 0;
var slug_from_path_1 = require("$utils/slug-from-path");
/** @type {import('@sveltejs/kit').RequestHandler} */
function get(_a) {
    var query = _a.query;
    return __awaiter(this, void 0, Promise, function () {
        var modules, crewPromises, _loop_1, _i, _b, _c, path, resolver, crew, publishedCrewMembers;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    modules = import.meta.glob("../../routes/markupfiles/crew/**/index.{md,svx,svelte.md}");
                    crewPromises = [];
                    _loop_1 = function (path, resolver) {
                        var slug = slug_from_path_1.slugFromPath(path);
                        var promise = resolver().then(function (post) {
                            return __assign({ slug: slug }, post.metadata);
                        });
                        crewPromises.push(promise);
                    };
                    for (_i = 0, _b = Object.entries(modules); _i < _b.length; _i++) {
                        _c = _b[_i], path = _c[0], resolver = _c[1];
                        _loop_1(path, resolver);
                    }
                    return [4 /*yield*/, Promise.all(crewPromises)];
                case 1:
                    crew = _d.sent();
                    publishedCrewMembers = crew.filter(function (post) { return post.published; });
                    return [2 /*return*/, {
                            body: publishedCrewMembers,
                            status: 200
                        }];
            }
        });
    });
}
exports.get = get;