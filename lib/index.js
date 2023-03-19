"use strict"

const req = require("cheerio-req")
    , typpy = require("typpy")
    , scrapeHTML = require("scrape-it-core")

/**
 * scrapeIt
 * A scraping module for humans.
 *
 * @name scrapeIt
 * @function
 * @param {String|Object} url The page url or request options.
 * @param {Object} opts The options passed to `scrapeHTML` method.
 * @param {Function} cb The callback function.
 * @return {Promise} A promise object resolving with:
 *
 *   - `data` (Object): The scraped data.
 *   - `$` (Function): The Cheeerio function. This may be handy to do some other manipulation on the DOM, if needed.
 *   - `response` (Object): The response object.
 *   - `body` (String): The raw body as a string.
 *
 */
async function scrapeIt (url, opts) {
    const res = await req(url)
    let scrapedData = scrapeIt.scrapeHTML(res.$, opts)
    return {
        ...res,
        data: scrapedData,
        body: res.data
    }
}

/**
 * scrapeIt.scrapeHTML
 * Scrapes the data in the provided element.
 *
 * For the format of the selector, please refer to the [Selectors section of the Cheerio library](https://github.com/cheeriojs/cheerio#-selector-context-root-)
 *
 * @name scrapeIt.scrapeHTML
 * @function
 * @param {Cheerio} $ The input element.
 * @param {Object} opts An object containing the scraping information.
 *
 *   If you want to scrape a list, you have to use the `listItem` selector:
 *
 *    - `listItem` (String): The list item selector.
 *    - `data` (Object): The fields to include in the list objects:
 *       - `<fieldName>` (Object|String): The selector or an object containing:
 *          - `selector` (String): The selector.
 *          - `convert` (Function): An optional function to change the value.
 *          - `how` (Function|String): A function or function name to access the
 *            value.
 *          - `attr` (String): If provided, the value will be taken based on
 *            the attribute name.
 *          - `trim` (Boolean): If `false`, the value will *not* be trimmed
 *            (default: `true`).
 *          - `closest` (String): If provided, returns the first ancestor of
 *            the given element.
 *          - `eq` (Number): If provided, it will select the *nth* element.
 *          - `texteq` (Number): If provided, it will select the *nth* direct text child.
 *            Deep text child selection is not possible yet.
 *            Overwrites the `how` key.
 *          - `listItem` (Object): An object, keeping the recursive schema of
 *            the `listItem` object. This can be used to create nested lists.
 *
 *   **Example**:
 *   ```js
 *   {
 *      articles: {
 *          listItem: ".article"
 *        , data: {
 *              createdAt: {
 *                  selector: ".date"
 *                , convert: x => new Date(x)
 *              }
 *            , title: "a.article-title"
 *            , tags: {
 *                  listItem: ".tags > span"
 *              }
 *            , content: {
 *                  selector: ".article-content"
 *                , how: "html"
 *              }
 *            , traverseOtherNode: {
 *                  selector: ".upperNode"
 *                , closest: "div"
 *                , convert: x => x.length
 *              }
 *          }
 *      }
 *   }
 *   ```
 *
 *   If you want to collect specific data from the page, just use the same
 *   schema used for the `data` field.
 *
 *   **Example**:
 *   ```js
 *   {
 *        title: ".header h1"
 *      , desc: ".header h2"
 *      , avatar: {
 *            selector: ".header img"
 *          , attr: "src"
 *        }
 *   }
 *   ```
 *
 * @returns {Object} The scraped data.
 */
scrapeIt.scrapeHTML = scrapeHTML

module.exports = scrapeIt
