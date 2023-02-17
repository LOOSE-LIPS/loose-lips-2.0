"use strict";

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _fs = _interopRequireDefault(require("fs"));

var _turndown = _interopRequireDefault(require("turndown"));

var _https = _interopRequireDefault(require("https"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// const jsonData = JSON.parse(fs.readFileSync("posts.json"));
var jsonData = [];
fetch("https://reqbin.com/echo/get/json", {
  method: "GET",
  headers: {
    Accept: "application/json"
  }
}).then(function (response) {
  return response.json();
}).then(function (response) {
  return jsonData.push(JSON.stringify(response));
});
jsonData.forEach(function (post) {
  var imageData = post.yoast_head_json.og_image;
  var directoryPath = "static/images/import/".concat(post.slug);

  _fs["default"].mkdir(directoryPath, function (err) {
    if (err) console.error(err);
  });

  var outputPaths = [];
  imageData.forEach(function (data) {
    var imageUrl = data.url;
    var outputPath = "static/images/import/".concat(post.slug, "/image").concat(post.id, ".jpeg");
    outputPaths.push(outputPath);
    var username = "seedpipdev";
    var password = "ThisIsAPassword";
    var options = {
      headers: {
        Authorization: "Basic " + Buffer.from(username + ":" + password).toString("base64")
      }
    };

    _https["default"].get(imageUrl, options, function (res) {
      var fileStream = _fs["default"].createWriteStream(outputPath);

      res.pipe(fileStream);
    });
  });
  var data = {
    id: post.id,
    date: post.date,
    title: post.yoast_head_json.title,
    type: post.type,
    slug: post.slug,
    author: post.author,
    banner: outputPaths,
    description: post.yoast_head_json.og_description,
    published: true,
    tags: post.tags
  };
  var turndownService = new _turndown["default"]();
  var markdownString = turndownService.turndown(post.content.rendered);

  var yamlData = _jsYaml["default"].safeDump(data);

  _fs["default"].writeFileSync("posts/".concat(post.slug, ".md"), "---\n" + yamlData.trim() + "\n---\n" + "".concat(markdownString));
});