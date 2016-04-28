## Documentation

You can see below the API reference of this module.

### `scrapeIt(url, opts, cb)`
A scraping module for humans.

#### Params
- **String|Object** `url`: The page url or request options.
- **Object|Array** `opts`: The options passed to `scrapeCheerio` method.
- **Function** `cb`: The callback function.

#### Return
- **Tinyreq** The request object.

### `scrapeIt.scrapeCheerio($input, opts, $)`
Scrapes the data in the provided element.

#### Params
- **Cheerio** `$input`: The input element.
- **Object** `opts`: An array or object containing the scraping information.
  If you want to scrape a list, you have to use the `listItem` selector:

   - `listItem` (String): The list item selector.
   - `name` (String): The list name (e.g. `articles`).
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
      listItem: ".article"
    , name: "articles"
    , data: {
          createdAt: {
              selector: ".date"
            , convert: x => new Date(x)
          }
        , title: "a.article-title"
        , tags: {
              selector: ".tags"
            , convert: x => x.split("|").map(c => c.trim()).slice(1)
          }
        , content: {
              selector: ".article-content"
            , how: "html"
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
- **Function** `$`: The Cheerio function.

#### Return
- **Object** The scrapped data.

