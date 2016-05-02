"use strict";

const req = require("cheerio-req")
    , typpy = require("typpy")
    , iterateObj = require("iterate-object")
    , Err = require("err")
    , objDef = require("obj-def")
    , emptyObj = require("is-empty-obj")
    ;

/**
 * scrapeIt
 * A scraping module for humans.
 *
 * @name scrapeIt
 * @function
 * @param {String|Object} url The page url or request options.
 * @param {Object|Array} opts The options passed to `scrapeCheerio` method.
 * @param {Function} cb The callback function.
 * @return {Tinyreq} The request object.
 */
function scrapeIt (url, opts, cb) {
    req(url, (err, $, res, body) => {
        if (err) { return cb(err); }
        cb(null, scrapeIt.scrapeCheerio($, opts), $, res, body);
    });
}

/**
 * scrapeIt.scrapeCheerio
 * Scrapes the data in the provided element.
 *
 * @name scrapeIt.scrapeCheerio
 * @function
 * @param {Cheerio} $input The input element.
 * @param {Object} opts An array or object containing the scraping information.
 *
 *   If you want to scrape a list, you have to use the `listItem` selector:
 *
 *    - `listItem` (String): The list item selector.
 *    - `name` (String): The list name (e.g. `articles`).
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
 *          - `eq` (Number): If provided, it will select the *nth* element.
 *          - `listItem` (Object): An object, keeping the recursive schema of
 *            the `listItem` object. This can be used to create nested lists.
 *
 *   **Example**:
 *   ```js
 *   {
 *       listItem: ".article"
 *     , name: "articles"
 *     , data: {
 *           createdAt: {
 *               selector: ".date"
 *             , convert: x => new Date(x)
 *           }
 *         , title: "a.article-title"
 *         , tags: {
 *               selector: ".tags"
 *             , convert: x => x.split("|").map(c => c.trim()).slice(1)
 *           }
 *         , content: {
 *               selector: ".article-content"
 *             , how: "html"
 *           }
 *       }
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
 * @param {Function} $ The Cheerio function.
 * @returns {Object} The scraped data.
 */
scrapeIt.scrapeCheerio = ($input, opts, $) => {

    if (!$) {
        $ = $input;
    }

    let normalizeOpt = v => {
            if (typpy(v, String)) {
                v = { selector: v };
            }
            objDef(v, "data", {});
            objDef(v, "how", "text", true);
            if (v.attr) {
                v.how = $elm => $elm.attr(v.attr);
            }
            objDef(v, "trimValue", true);
            return v;
        }
      , handleDataObj = (data, $context) => {
            let pageData = {};
            iterateObj(data, (cOpt, optName) => {
                cOpt = normalizeOpt(cOpt);
                cOpt.name = optName;

                let $cContext = $context === $ ? undefined : $context
                  , $elm = cOpt.selector ? $(cOpt.selector, $cContext) : $cContext
                  ;

                // Handle lists
                if (cOpt.listItem) {
                    let docs = pageData[cOpt.name] = []
                      , $items = $(cOpt.listItem, $cContext)
                      , isEmpty = emptyObj(cOpt.data)
                      ;

                    if (isEmpty) {
                        cOpt.data.___raw = {};
                    }

                    for (let i = 0; i < $items.length; ++i) {
                        let cDoc = handleDataObj(cOpt.data, $items.eq(i));
                        docs.push(cDoc.___raw || cDoc);
                    }
                } else {
                    if (typpy(cOpt.eq, Number)) {
                        $elm = $elm.eq(v.eq);
                    }

                    let value = typpy(cOpt.how, Function) ? cOpt.how($elm) : $elm[cOpt.how]();

                    if (cOpt.convert) {
                        value = cOpt.convert(value);
                    }

                    if (cOpt.trimValue && typpy(value, String)) {
                        value = value.trim();
                    }

                    pageData[cOpt.name] = value;
                //if (v.listItem) {
                //    v.name = "_";
                //    value = scrapeIt.scrapeCheerio($elm, v, $)._.map(c => c._);


                }

            });
            return pageData;
        }
      ;

    return handleDataObj(opts);
}

module.exports = scrapeIt;
