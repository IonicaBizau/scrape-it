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

    t.it("end", () => {
        process.exit();
    });
});
