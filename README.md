
[![scrape-it](https://i.imgur.com/j3Z0rbN.png)](#)

# scrape-it

 [![Patreon](https://img.shields.io/badge/Support%20me%20on-Patreon-%23e6461a.svg)][patreon] [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Travis](https://img.shields.io/travis/IonicaBizau/scrape-it.svg)](https://travis-ci.org/IonicaBizau/scrape-it/) [![Version](https://img.shields.io/npm/v/scrape-it.svg)](https://www.npmjs.com/package/scrape-it) [![Downloads](https://img.shields.io/npm/dt/scrape-it.svg)](https://www.npmjs.com/package/scrape-it) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

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


## :moneybag: Donations

Another way to support the development of my open-source modules is
to [set up a recurring donation, via Patreon][patreon]. :rocket:

[PayPal donations][paypal-donations] are appreciated too! Each dollar helps.

Thanks! :heart:

## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`3abn`](https://github.com/IonicaBizau/3abn#readme)—A 3ABN radio client in the terminal.
 - [`bandcamp-scraper`](https://github.com/masterT/bandcamp-scraper) (by Simon Thiboutôt)—A scraper for https://bandcamp.com
 - [`cevo-lookup`](https://npmjs.com/package/cevo-lookup) (by Zack Boehm)—Searchs the CEVO Suspension List for bans by SteamID
 - [`codementor`](https://github.com/IonicaBizau/codementor#readme)—A scraper for codementor.io.
 - [`proxylist`](https://github.com/selfrefactor/proxylist#readme) (by self_refactor)—Get free proxy list
 - [`sahibinden`](https://npmjs.com/package/sahibinden) (by Cagatay Cali)—Simple sahibinden.com bot
 - [`sahibindenServer`](https://npmjs.com/package/sahibindenServer) (by Cagatay Cali)—Simple sahibinden.com bot server side
 - [`sgdq-collector`](https://github.com/bcongdon/sgdq-collector#readme) (by Benjamin Congdon)—Collects Twitch / Donation information and pushes data to Firebase
 - [`ubersetzung`](https://github.com/selfrefactor/ubersetzung#readme) (by self_refactor)—translate words with examples from German to English
 - [`ui-studentsearch`](https://github.com/rkkautsar/ui-studentsearch#readme) (by Rakha Kanz Kautsar)—API for majapahit.cs.ui.ac.id/studentsearch

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[patreon]: https://www.patreon.com/ionicabizau
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2016#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
