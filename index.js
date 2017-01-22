const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/scrape', function(req, res) {
    const url = 'http://unicode.org/emoji/charts/full-emoji-list.html';
    let json = [];

    request(url, function(error, response, html) {
        if (!error) {
            const $ = cheerio.load(html);

            $('tr').filter(function () {
                const data = $(this);

                const id = data.children().first().text();
                const utf_code = data.children().eq(1).text();
                const emoji = data.find('.chars').text();
                const name = data.children().eq(-3).text();
                const keywords = data.children().eq(-1).text();

                json.push({
                    id: id,
                    utf_code: utf_code,
                    name: name,
                    emoji: emoji,
                    keywords: keywords
                });
            })

            fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

                console.log('File successfully written! - Check your project directory for the output.json file');

            })

            res.json({ message: 'hooray! We finihed scraping! Check your project directory for the output.json file!' });

        } else {
            console.log('We got an error');
        }
    })
})

app.listen(1337);