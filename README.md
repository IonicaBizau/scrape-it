
[![scrape-it](https://i.imgur.com/j3Z0rbN.png)](#)

# scrape-it

 [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Travis](https://img.shields.io/travis/IonicaBizau/scrape-it.svg)](https://travis-ci.org/IonicaBizau/scrape-it/) [![Version](https://img.shields.io/npm/v/scrape-it.svg)](https://www.npmjs.com/package/scrape-it) [![Downloads](https://img.shields.io/npm/dt/scrape-it.svg)](https://www.npmjs.com/package/scrape-it) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> A Node.js scraper for humans.

## :cloud: Installation

```sh
$ npm i --save scrape-it
```


## :clipboard: Example



```js
const scrapeIt = require("scrape-it");

function parseStatusCurrent(description){
    var status = {};
    status.description = description.trim();
    if(status.description == 'All Systems Operational'){
        status.indicator = "Operational";
        status.color = "green";
    }
    else if(status.description.indexOf('Minor')>-1){
        status.indicator = "Not Fully Operational";
        status.color = "yellow";
    }
    else {
        status.indicator = "Not Fully Operational";
        status.color = "red";
    }
    return status;
}

scrapeIt("https://status.airbrake.io/", {
    status: {
	selector: ".page-status span.status",
        data: {}
	convert:  parseStatusCurrent
    }
  , provider: {
        selector: ".powered-by"
        , convert: (function (text) {
            if(text == "Powered by StatusPage.io"){
                return "StatusPage.io";
            }
            else {
                return "Unknown";
            }
        })
    }
  , updated_at: {
        convert: new Date().toISOString()
    }
}).then(status => {
    console.log(status);
}).catch(console.log);
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


## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2016#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
