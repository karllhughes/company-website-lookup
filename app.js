var google = require('google');
var json2csv = require('json2csv');
var fs = require('fs');
var async = require("async");

var results = [];

var fields = ['search', 'page_title', 'google_link'];

var searches = require('./searches.js').getSearches();

google.resultsPerPage = 3;

async.each(searches,
    function(search, callback) {
        google(search, function (err, next, links) {
            if (links) {
                var title = links[0].title;
                if (title.indexOf("Map for ") > -1 && links[1]) {
                    title = links[1].title;
                    var link = links[1].link;
                } else {
                    title = links[0].title;
                    var link = links[0].link;
                }
                var row = {
                    'search': search,
                    'title': title,
                    'link': link
                };
                results.push(row);
            }
            callback();
        });
    },
    function(err){
        // All tasks are done now
        if (results[0]) {
            json2csv({ data: results }, function(err, csv) {
                if (err) console.log(err);
                fs.writeFile('output.csv', csv, function(err) {
                    if (err) throw err;
                    console.log('file saved');
                });
            });
        } else {
            console.log("No results received.");
        }
    }
);
