var Bing = require('bing.search');
var json2csv = require('json2csv');
var fs = require('fs');
var async = require("async");

var results = [];

var fields = ['search', 'page_title', 'google_link'];

var searches = require('./searches.js').getSearches();

bing = new Bing('APIKEY');

async.each(searches,
    function(search, callback) {
        bing.web(search, {top: 5}, function (err, links) {
            if (links && links[0]) {
                var title = links[0].title;
                var link = links[0].url;
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
