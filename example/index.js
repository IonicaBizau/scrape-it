"use strict";

const scrapeIt = require("../lib");

function parseStatusCurrent(description){
    var status = {};
    status.description = description.trim();
    if(status.description == 'All Systems Operational'){
        status.indicator = "Operational";
        status.color = "green";
    }
    else if(status.description.indexOf('Minor')>-1){
        status.indicator = "Not Fully Operational";
        status.color = "yellow";
    }
    else {
        status.indicator = "Not Fully Operational";
        status.color = "red";
    }
    return status;
}

scrapeIt("https://status.airbrake.io/", {
    status: {
	selector: ".page-status span.status",
        data: {}
	convert:  parseStatusCurrent
    }
  , provider: {
        selector: ".powered-by"
        , convert: (function (text) {
            if(text == "Powered by StatusPage.io"){
                return "StatusPage.io";
            }
            else {
                return "Unknown";
            }
        })
    }
  , updated_at: {
        convert: new Date().toISOString()
    }
}).then(status => {
    console.log(status);
}).catch(console.log);
