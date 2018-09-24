'use strict'

const https = require('https');

exports.handler = (event, context, callback) => {

    let startDate = event.startDate;
    let endDate = event.endDate;
    let symbol = event.id;

    console.log("Fetching from external API using params: symbol=" + symbol + ", startDate=" + startDate + ", endDate=" + endDate);

    let options = {
        host : 'www.alphavantage.co',
        path:  '/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&apikey=69EIOWSLWWDLTMWU',
        port: 443,
        method: 'GET'

    };
    const req = https.request(options, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            if (res.headers['content-type'] === 'application/json') {
                body = JSON.parse(body)['Time Series (Daily)'];
            }
            let requestedData = [];
            for (let key in body) {
                let dateTime = new Date(key).getTime()/1000;
                let dateStart = new Date(startDate).getTime()/1000;
                let dateEnd = new Date(endDate).getTime()/1000;

                if (dateTime < dateStart || dateTime > dateEnd) {
                    continue;
                }

                let timestamp = dateTime.toFixed(3);
                let dataForSingleDate = body[key];
                let price = parseFloat(dataForSingleDate['4. close']);
                let volume = parseFloat(dataForSingleDate['5. volume']);

                let elements = {};
                elements["timestamp"] = timestamp;
                elements["price"] = JSON.stringify(price);
                elements["volume"] = JSON.stringify(volume);

                requestedData.push(elements);
             }

            let dataResponse = {
                "symbol": symbol,
                "start": startDate,
                "end": endDate,
                "stocks": requestedData
            }

            callback(null, dataResponse);
        });
    });
    req.on('error', callback);
    req.end();
};
