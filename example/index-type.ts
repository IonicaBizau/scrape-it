"use strict";

import scrapeIt from "../lib";

// Promise interface
scrapeIt("https://ionicabizau.net", {
    title: ".header h1",
    desc: ".header h2",
    avatar: {
        selector: ".header img",
        attr: "src",
    },
}).then(({ data, status }) => {
    console.log(`Status Code: ${status}`);
    console.log(data);
});

// Async-Await
(async () => {
    const { data } = await scrapeIt("https://ionicabizau.net", {
        // Fetch the articles
        articles: {
            listItem: ".article",
            data: {
                // Get the article date and convert it into a Date object
                createdAt: {
                    selector: ".date",
                    convert: (x) => new Date(x),
                },
                // Get the title
                title: "a.article-title",
                // Nested list
                tags: {
                    listItem: ".tags > span",
                },
                // Get the content
                content: {
                    selector: ".article-content",
                    how: "html",
                },
                // Get attribute value of root listItem by omitting the selector
                classes: {
                    attr: "class",
                },
            },
        },
        // Fetch the blog pages
        pages: {
            listItem: "li.page",
            data: {
                title: "a",
                url: {
                    selector: "a",
                    attr: "href",
                },
            },
        },
        // Fetch some other data from the page
        title: ".header h1",
        desc: ".header h2",
        avatar: {
            selector: ".header img",
            attr: "src",
        },
    });
    //console.log(data);
})();



(() => {
    const { data } = scrapeIt.scrapeHTML<{data: unknown}>("https://ionicabizau.net", {
        data: {
            listItem: 'main',
            data: {
                items:{
                    selector: 'article',
                    how: (element) => {
                        const $items = element.find('p:nth-child(n+2)')
                        return $items.text()
                    }
                }
            }
        }
    })
    console.log(data)
})