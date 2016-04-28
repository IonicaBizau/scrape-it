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

    if (typpy(opts, Object)) {
        opts = [opts];
    }

    let pageData = {}
      , normalizeOpt = v => {
            if (typpy(v, String)) {
                v = { selector: v };
            }
            objDef(v, "how", "text", true);
            if (v.attr) {
                v.how = $elm => $elm.attr(v.attr);
            }
            objDef(v, "trimValue", true);
            return v;
        }
      ;

    opts.forEach(cOpt => {
        if (cOpt.listItem) {
            if (pageData[cOpt.name]) {
                throw new Err("There is already a field named <field> in the page data object", {
                    code: "DUPLICATE_FIELD"
                  , field: cOpt.name
                });
            }

            let docs = pageData[cOpt.name] = []
              , $items = $(cOpt.listItem, $input === $ ? undefined : $input)
              , isEmpty = emptyObj(cOpt.data)
              ;

            cOpt.data = cOpt.data || {};
            if (isEmpty) {
                cOpt.data._ = {};
            }

            for (let i = 0; i < $items.length; ++i) {
                let cDoc = {};
                iterateObj(cOpt.data, (v, n) => {
                    v = normalizeOpt(v);

                    let $elm = $items.eq(i);
                    if (v.selector) {
                        $elm = $elm.find(v.selector)
                    }

                    if (typpy(v.eq, Number)) {
                        $elm = $elm.eq(v.eq);
                    }

                    let value = null;
                    if (v.listItem) {
                        v.name = "_";
                        value = scrapeIt.scrapeCheerio($elm, v, $)._.map(c => c._);
                    } else {
                        value = typpy(v.how, Function) ? v.how($elm, cDoc) : $elm[v.how]();
                    }

                    if (v.convert) {
                        value = v.convert(value);
                    }

                    if (v.trimValue && typpy(value, String)) {
                        value = value.trim();
                    }


                    cDoc[n] = value;
                });

                docs.push(cDoc);
            }

        } else {
            iterateObj(cOpt, (v, n) => {
                v = normalizeOpt(v);
                let $elm = $(v.selector);
                if (typpy(v.eq, Number)) {
                    $elm = $elm.eq(v.eq);
                }

                let value = typpy(v.how, Function) ? v.how($elm) : $elm[v.how]();

                if (v.convert) {
                    value = v.convert(value);
                }

                if (v.trimValue && typpy(value, String)) {
                    value = value.trim();
                }

                pageData[n] = value;
            });
        }
    });
    return pageData;
}

module.exports = scrapeIt;
