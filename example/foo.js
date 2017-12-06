"use strict"

const scrapeIt = require("../lib")

var url = 'https://www.fandango.com/metrograph-aaxuz/theater-page?date=2017-11-16';

var schema = {
  showtimes: {
    listItem: '.fd-movie',
    data: {
      title: '.fd-movie__title'
    }
  }
};

scrapeIt(url, schema).then(scrapedContent => {
  console.log(`✔  [TEST] Fandango theater data fetched}`);
  console.log(url);
  console.log(scrapedContent);  // this is { showtimes: [] } :(
  return scrapedContent;
});
