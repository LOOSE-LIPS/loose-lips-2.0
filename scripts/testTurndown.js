import TurndownService from "turndown";

const turndownService = new TurndownService();
const test = "<a><p><h1> HEYYYY <3<p>  href</p> </h1></p></a>";
const test2 =
  '<iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album=879490178/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/track=1692828727/transparent=true/" seamless="">&lt;a href=&#8221;http://matiasaguayo.bandcamp.com/album/support-alien-invasion-2&#8243;&gt;Support Alien Invasion by Matias Aguayo&lt;/a&gt;</iframe>';

turndownService.addRule("deleteTagAndContents", {
  filter: "iframe",
  replacement: function () {
    return "";
  },
});

// turndownService.addRule("test2", {
//   filter: "h1",
//   replacement: function (content) {
//     return content.replace("HEYYYY", "");
//   },
// });

// turndownService.addRule("anchor", {
//   filter: "a",
//   replacement: function (content, node) {
//     return "";
//   },
// });

const markdownString = turndownService.turndown(`${test2}`);
console.log(markdownString);
