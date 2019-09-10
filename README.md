













![scrape-it](https://i.imgur.com/j3Z0rbN.png)




# scrape-it

A Node.js scraper for humans.




## Installation

```sh
$ npm i scrape-it
```









## Example






```js
"use strict"

const scrapeIt = require("scrape-it")

// Promise interface
scrapeIt("https://ionicabizau.net", {
    title: ".header h1"
  , desc: ".header h2"
  , avatar: {
        selector: ".header img"
      , attr: "src"
    }
}).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`)
    console.log(data)
})

// Callback interface
scrapeIt("https://ionicabizau.net", {
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

            // Get attribute value of root listItem by omitting the selector
          , classes: {
                attr: "class"
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
}, (err, { data }) => {
    console.log(err || data)
})
// { articles:
//    [ { createdAt: Mon Mar 14 2016 00:00:00 GMT+0200 (EET),
//        title: 'Pi Day, Raspberry Pi and Command Line',
//        tags: [Object],
//        content: '<p>Everyone knows (or should know)...a" alt=""></p>\n',
//        classes: [Object] },
//      { createdAt: Thu Feb 18 2016 00:00:00 GMT+0200 (EET),
//        title: 'How I ported Memory Blocks to modern web',
//        tags: [Object],
//        content: '<p>Playing computer games is a lot of fun. ...',
//        classes: [Object] },
//      { createdAt: Mon Nov 02 2015 00:00:00 GMT+0200 (EET),
//        title: 'How to convert JSON to Markdown using json2md',
//        tags: [Object],
//        content: '<p>I love and ...',
//        classes: [Object] } ],
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






## Documentation





### `scrapeIt(url, opts, cb)`
A scraping module for humans.

#### Params
- **String|Object** `url`: The page url or request options.
- **Object** `opts`: The options passed to `scrapeHTML` method.
- **Function** `cb`: The callback function.

#### Return
- **Promise** A promise object resolving with:
  - `data` (Object): The scraped data.
  - `$` (Function): The Cheeerio function. This may be handy to do some other manipulation on the DOM, if needed.
  - `response` (Object): The response object.
  - `body` (String): The raw body as a string.

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
         - `texteq` (Number): If provided, it will select the *nth* direct text child.
           Deep text child selection is not possible yet.
           Overwrites the `how` key.
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






## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].



## License
See the [LICENSE][license] file.


[license]: /LICENSE
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
