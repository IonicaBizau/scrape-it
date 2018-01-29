const tester = require("tester")
    , Lien = require("lien")
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
        }, (err, { data }) => {
            t.expect(err).toBe(null);
            t.expect(data).toEqual({
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
        }, (err, { data }) => {
            t.expect(err).toBe(null);
            t.expect(data).toEqual({
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
        }).then(({ data }) => {
            t.expect(data).toEqual({
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
        }, (err, { data }) => {
            t.expect(data).toEqual({
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
                        closest: "table",
                        convert(html, $node) {
                            return $node.find("thead .city").text();
                        }
                    }
                }
            }
        }, (err, { data }) => {
            t.expect(err).toBe(null);
            t.expect(data).toEqual({
                addresses: [
                    { address: "one way street", suburb: "Sydney" },
                    { address: "GT Road", suburb: "Sydney" }
                ]
            });
            cb();
        });
    });

    t.it("text nodes", cb => {
        scrapeIt(URL, {
            line0: {
                selector: ".textnodes",
                texteq: 0
            },
            line1: {
                selector: ".textnodes",
                texteq: 1
            }
        }, (err, { data }) => {
            t.expect(err).toBe(null);
            t.expect(data).toEqual({
                line0: "Line0",
                line1: "Line1"
            });
            cb();
        });
    });

    t.it("only direct text nodes", cb => {
        scrapeIt(URL, {
            deep_line: {
                selector: ".deep-textnodes",
                texteq: 2
            }
        }, (err, { data }) => {
            t.expect(err).toBe(null);
            t.expect(data).toEqual({
                deep_line: ""
            });
            cb();
        });
    });

    t.it("end", () => {
        process.exit();
    });
});
