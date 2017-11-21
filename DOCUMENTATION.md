## Documentation

You can see below the API reference of this module.

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

