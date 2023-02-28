import TurndownService from "turndown";

const turndownService = new TurndownService();
const test = "<a><p><h1> HEYYYY <3<p>  href</p> </h1></p></a>";
const test2 = "<p>>> CLUBFOOT [Strange Riddims] <<</p>";

turndownService.addRule("test2", {
  filter: "p",
  replacement: function (content) {
    return content.replace(/<<|>>/gi, "");
  },
});

// turndownService.addRule("anchor", {
//   filter: "a",
//   replacement: function (content, node) {
//     return "";
//   },
// });

const markdownString = turndownService.turndown(`${test2}`);
console.log(markdownString);
