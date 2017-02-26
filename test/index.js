const tester = require("tester")
    , Lien = require("lien")
    , cheerio = require("cheerio")
    , scrapeIt = require("..")
    ;

const PORT = 9000
    , HOST = "http://localhost"
    , URL = HOST + ":" + PORT
    ;

tester.describe("scrape-it", t => {
    t.it("start the server", cb => {
        new Lien({
            port: 9000
          , public: `${__dirname}/public`
        }).on("load", cb);
    });
    t.it("scrape simple data", cb => {
        scrapeIt(URL, {
            title: "h1.title"
          , description: ".description"
          , date: {
                selector: ".date"
              , convert: x => new Date(x)
            }
        }, (err, page) => {
            t.expect(err).toBe(null);
            t.expect(page).toEqual({
                title: "Title"
              , description: "Lorem ipsum"
              , date: new Date("1988-01-01")
            });
            cb();
        });
    });
    t.it("scrape lists", cb => {
        scrapeIt(URL, {
            features: {
                listItem: ".features > li"
            }
        }, (err, page) => {
            t.expect(err).toBe(null);
            t.expect(page).toEqual({
                features: [
                    "1"
                  , "2"
                  , "3"
                  , "4"
                  , "5"
                  , "6"
                ]
            });
            cb();
        });
    });
    t.it("promise version", cb => {
        scrapeIt(URL, {
            features: {
                listItem: ".features > li"
            }
        }).then(page => {
            t.expect(page).toEqual({
                features: [
                    "1"
                  , "2"
                  , "3"
                  , "4"
                  , "5"
                  , "6"
                ]
            });
            cb();
        });
    });
    t.it("nested objects", cb => {
        scrapeIt(URL, {
            nested: {
                selector: ".nested"
              , data: {
                    foo: {
                        data: {
                            level1: {
                                selector: ".level1"
                              , data: {
                                    level2: {
                                        selector: "span"
                                      , eq: 1
                                    }
                                }
                            }
                          , level1Text: "span"
                          , level2Text: ".level2"
                        }
                    }
                }
            }
        }, (err, page) => {
            t.expect(page).toEqual({
                nested: {
                    foo: {
                        level1: {
                            level2: "2"
                        }
                      , level2Text: "2"
                      , level1Text: "Foo12"
                    }
                }
            });
            cb();
        });
    });
    t.it("closet sample", cb => {
        scrapeIt(URL, {
            addresses: {
                listItem: "table tbody tr",
                data: {
                    address: ".address",
                    suburb: {
                        selector: ".city",
                        closest: "table",
                        convert(html) {
                            $ = cheerio.load(html);
                            return ($.text($('.city')));
                        }
                    }
                }
            }
        }, (err, page) => {
            t.expect(err).toBe(null);
            t.expect(page).toEqual({
                addresses: [
                    { address: "one way street", suburb: "Sydney" },
                    { address: "GT Road", suburb: "Sydney" }
                ]
            });
            cb();
        });
    });

    t.it("end", () => {
        process.exit();
    });
});
