const tester = require("tester")
    , Lien = require("lien")
    , scrapeIt = require("..")
    ;

const PORT = 9000
    , HOST = "http://localhost"
    , URL = HOST + ":" + PORT
    ;

tester.describe("scrape-it", async t => {
    debugger
    await t.it("start the server", cb => {
        new Lien({
            port: 9000
          , public: `${__dirname}/public`
        }).on("load", cb);
    });

    await t.it("scrape simple data", async cb => {
        const { data } = await scrapeIt(URL, {
            title: "h1.title"
          , description: ".description"
          , date: {
                selector: ".date"
              , convert: x => new Date(x)
            }
        })
        t.expect(data).toEqual({
            title: "Title"
          , description: "Lorem ipsum"
          , date: new Date("1988-01-01")
        });
        cb();
    });

    await t.it("scrape lists", async cb => {
        const { data } = await scrapeIt(URL, {
            features: {
                listItem: ".features > li"
            }
        })
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

    await t.it("scrape and convert lists", async cb => {
        const { data } = await scrapeIt(URL, {
            features: {
                listItem: ".features > li",
                convert: x => parseInt(x, 10)
            }
        })
        t.expect(data).toEqual({
            features: [1, 2, 3, 4, 5, 6]
        });
        cb();
    });

    await t.it("promise version", async cb => {
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

    await t.it("nested objects", async cb => {
        const { data } = await scrapeIt(URL, {
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
        })
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

    await t.it("closest sample", async cb => {
        const { data } = await scrapeIt(URL, {
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
        })
        t.expect(data).toEqual({
            addresses: [
                { address: "one way street", suburb: "Sydney" },
                { address: "GT Road", suburb: "Sydney" }
            ]
        });
        cb();
    });

    await t.it("text nodes", async cb => {
        const { data } = await scrapeIt(URL, {
            line0: {
                selector: ".textnodes",
                texteq: 0
            },
            line1: {
                selector: ".textnodes",
                texteq: 1
            }
        })
        t.expect(data).toEqual({
            line0: "Line0",
            line1: "Line1"
        });
        cb();
    });

    await t.it("only direct text nodes", async cb => {
        const { data } = await scrapeIt(URL, {
            deep_line: {
                selector: ".deep-textnodes",
                texteq: 2
            }
        })
        t.expect(data).toEqual({
            deep_line: ""
        });
        cb();
    });

    await t.it("end", () => {
        process.exit();
    });
});
