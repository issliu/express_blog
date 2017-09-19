'use strict';
let http = require('http');
let fs = require('fs');
let cheerio = require('cheerio');
let request = require('request');

let BufferHelper = require('bufferhelper');
let iconv = require('iconv-lite');

let url = "http://news.163.com/latest/";

http.get(url, res => {
    console.log(Object.keys(res));
    let html = '';
    let titles = [];

    let bufferHelper = new BufferHelper();

    res.on('data', chunk => {
        bufferHelper.concat(chunk);
    });
    res.on('end', () => {

        let tex = iconv.decode(bufferHelper.toBuffer(), 'gb2312');

        fs.writeFile('./res.html', tex);

        let $ = cheerio.load(tex);
        let instantNewsScripts = $('script[src*=instant10]');
        let scriptUrl = instantNewsScripts[0].attribs.src;

        http.get(scriptUrl, res => {
            let bufferHelper = new BufferHelper();

            res.on('data', chunk => {
                bufferHelper.concat(chunk);
            });
            res.on('end', () => {
                let tex = iconv.decode(bufferHelper.toBuffer(), 'gb2312');
                // eval(tex);
                // console.log(112, window.instant)
            });

            http.get('http://news.163.com/special/0001220O/news_json.js', res => {

                let bufferHelper = new BufferHelper();

                res.on('data', chunk => {
                    bufferHelper.concat(chunk);
                });
                res.on('end', () => {
                    let tex = iconv.decode(bufferHelper.toBuffer(), 'gb2312');
                    // eval(tex);
                    console.log(eval(tex));

                });

            })
        });
    })
});
