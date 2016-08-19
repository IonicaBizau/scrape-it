"use strict";

const scrapeIt = require("scrape-it");

// Promise interface
scrapeIt("http://ionicabizau.net", {
    title: ".header h1"
  , desc: ".header h2"
  , avatar: {
        selector: ".header img"
      , attr: "src"
    }
}).then(page => {
  console.log(page);
});
