"use strict"

const scrapeIt = require("../lib")

const username = "emanuelacolta"

// Scrape Emma's profile
scrapeIt(`https://twitter.com/${username}`, {
    name: ".ProfileHeaderCard-nameLink"
  , bio: ".ProfileHeaderCard-bio"
}).then(({ data }) => console.log(data)).catch(console.error)
// =>
// { name: 'Emanuela Colta',
//   bio: 'Junior Full-Stack Web Developer | ...' }
