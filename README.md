
[![scrape-it](https://i.imgur.com/j3Z0rbN.png)](#)

# scrape-it

 [![Support me on Patreon][badge_patreon]][patreon] [![Buy me a book][badge_amazon]][amazon] [![PayPal][badge_paypal_donate]][paypal-donations] [![Travis](https://img.shields.io/travis/IonicaBizau/scrape-it.svg)](https://travis-ci.org/IonicaBizau/scrape-it/) [![Version](https://img.shields.io/npm/v/scrape-it.svg)](https://www.npmjs.com/package/scrape-it) [![Downloads](https://img.shields.io/npm/dt/scrape-it.svg)](https://www.npmjs.com/package/scrape-it)

> A Node.js scraper for humans.

## :cloud: Installation

```sh
$ npm i --save scrape-it
```


## :clipboard: Example



```js
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

// Callback interface
scrapeIt("http://ionicabizau.net", {
    // Fetch the articles
    articles: {
        listItem: ".article"
      , data: {

            // Get the article date and convert it into a Date object
            createdAt: {
                selector: ".date"
              , convert: x => new Date(x)
            }

            // Get the title
          , title: "a.article-title"

            // Nested list
          , tags: {
                listItem: ".tags > span"
            }

            // Get the content
          , content: {
                selector: ".article-content"
              , how: "html"
            }
        }
    }

    // Fetch the blog pages
  , pages: {
        listItem: "li.page"
      , name: "pages"
      , data: {
            title: "a"
          , url: {
                selector: "a"
              , attr: "href"
            }
        }
    }

    // Fetch some other data from the page
  , title: ".header h1"
  , desc: ".header h2"
  , avatar: {
        selector: ".header img"
      , attr: "src"
    }
}, (err, page) => {
    console.log(err || page);
});
// { articles:
//    [ { createdAt: Mon Mar 14 2016 00:00:00 GMT+0200 (EET),
//        title: 'Pi Day, Raspberry Pi and Command Line',
//        tags: [Object],
//        content: '<p>Everyone knows (or should know)...a" alt=""></p>\n' },
//      { createdAt: Thu Feb 18 2016 00:00:00 GMT+0200 (EET),
//        title: 'How I ported Memory Blocks to modern web',
//        tags: [Object],
//        content: '<p>Playing computer games is a lot of fun. ...' },
//      { createdAt: Mon Nov 02 2015 00:00:00 GMT+0200 (EET),
//        title: 'How to convert JSON to Markdown using json2md',
//        tags: [Object],
//        content: '<p>I love and ...' } ],
//   pages:
//    [ { title: 'Blog', url: '/' },
//      { title: 'About', url: '/about' },
//      { title: 'FAQ', url: '/faq' },
//      { title: 'Training', url: '/training' },
//      { title: 'Contact', url: '/contact' } ],
//   title: 'Ionică Bizău',
//   desc: 'Web Developer,  Linux geek and  Musician',
//   avatar: '/images/logo.png' }
```

## :question: Get Help

There are few ways to get help:

 1. Please [post questions on Stack Overflow](https://stackoverflow.com/questions/ask). You can open issues with questions, as long you add a link to your Stack Overflow question.
 2. For bug reports and feature requests, open issues. :bug:
 3. For direct and quick help from me, you can [use Codementor](https://www.codementor.io/johnnyb). :rocket:


## :memo: Documentation


### `scrapeIt(url, opts, cb)`
A scraping module for humans.

#### Params
- **String|Object** `url`: The page url or request options.
- **Object** `opts`: The options passed to `scrapeHTML` method.
- **Function** `cb`: The callback function.

#### Return
- **Promise** A promise object.

### `scrapeIt.scrapeHTML($, opts)`
Scrapes the data in the provided element.

#### Params
- **Cheerio** `$`: The input element.
- **Object** `opts`: An object containing the scraping information.
  If you want to scrape a list, you have to use the `listItem` selector:

   - `listItem` (String): The list item selector.
   - `data` (Object): The fields to include in the list objects:
      - `<fieldName>` (Object|String): The selector or an object containing:
         - `selector` (String): The selector.
         - `convert` (Function): An optional function to change the value.
         - `how` (Function|String): A function or function name to access the
           value.
         - `attr` (String): If provided, the value will be taken based on
           the attribute name.
         - `trim` (Boolean): If `false`, the value will *not* be trimmed
           (default: `true`).
         - `closest` (String): If provided, returns the first ancestor of
           the given element.
         - `eq` (Number): If provided, it will select the *nth* element.
         - `listItem` (Object): An object, keeping the recursive schema of
           the `listItem` object. This can be used to create nested lists.

  **Example**:
  ```js
  {
     articles: {
         listItem: ".article"
       , data: {
             createdAt: {
                 selector: ".date"
               , convert: x => new Date(x)
             }
           , title: "a.article-title"
           , tags: {
                 listItem: ".tags > span"
             }
           , content: {
                 selector: ".article-content"
               , how: "html"
             }
           , traverseOtherNode: {
                 selector: ".upperNode"
               , closest: "div"
               , convert: x => x.length
             }
         }
     }
  }
  ```

  If you want to collect specific data from the page, just use the same
  schema used for the `data` field.

  **Example**:
  ```js
  {
       title: ".header h1"
     , desc: ".header h2"
     , avatar: {
           selector: ".header img"
         , attr: "src"
       }
  }
  ```

#### Return
- **Object** The scraped data.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :sparkling_heart: Support my projects

I open-source almost everything I can, and I try to reply everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications *for free*! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

 - Starring and sharing the projects you like :rocket:
 - [![PayPal][badge_paypal]][paypal-donations]—You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
 - [![Support me on Patreon][badge_patreon]][patreon]—Set up a recurring monthly donation and you will get interesting news about what I'm doing (things that I don't share with everyone).
 - **Bitcoin**—You can send me bitcoins at this address (or scanning the code below): `1P9BRsmazNQcuyTxEqveUsnf5CERdq35V6`

    ![](https://i.imgur.com/z6OQI95.png)

Thanks! :heart:


## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`3abn`](https://github.com/IonicaBizau/3abn#readme)—A 3ABN radio client in the terminal.
 - [`bandcamp-scraper`](https://github.com/masterT/bandcamp-scraper) (by Simon Thiboutôt)—A scraper for https://bandcamp.com
 - [`cevo-lookup`](https://npmjs.com/package/cevo-lookup) (by Zack Boehm)—Searchs the CEVO Suspension List for bans by SteamID
 - [`codementor`](https://github.com/IonicaBizau/codementor#readme)—A scraper for codementor.io.
 - [`degusta-scrapper`](https://github.com/yohendry/degusta-scrapper#readme) (by yohendry hurtado)—desgusta scrapper for alexa skill
 - [`proxylist`](https://github.com/selfrefactor/proxylist#readme) (by self_refactor)—Get free proxy list
 - [`rs-api`](https://github.com/alexisio/rs-api#readme) (by Alex Kempf)—Simple wrapper for RuneScape APIs written in node.
 - [`sahibinden`](https://npmjs.com/package/sahibinden) (by Cagatay Cali)—Simple sahibinden.com bot
 - [`sahibindenServer`](https://npmjs.com/package/sahibindenServer) (by Cagatay Cali)—Simple sahibinden.com bot server side
 - [`sgdq-collector`](https://github.com/bcongdon/sgdq-collector#readme) (by Benjamin Congdon)—Collects Twitch / Donation information and pushes data to Firebase
 - [`trump-cabinet-picks`](https://github.com/LindaHaviv/trump-cabinet-picks#readme) (by Linda Haviv)—NYT cabinet predictions for Trump admin.
 - [`ubersetzung`](https://github.com/selfrefactor/ubersetzung#readme) (by self_refactor)—translate words with examples from German to English
 - [`ui-studentsearch`](https://github.com/rkkautsar/ui-studentsearch#readme) (by Rakha Kanz Kautsar)—API for majapahit.cs.ui.ac.id/studentsearch

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[badge_patreon]: http://ionicabizau.github.io/badges/patreon.svg
[badge_amazon]: http://ionicabizau.github.io/badges/amazon.svg
[badge_paypal]: http://ionicabizau.github.io/badges/paypal.svg
[badge_paypal_donate]: http://ionicabizau.github.io/badges/paypal_donate.svg
[patreon]: https://www.patreon.com/ionicabizau
[amazon]: http://amzn.eu/hRo9sIZ
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(https%3A%2F%2Fionicabizau.net)&year=2016#license-mit
[website]: https://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
