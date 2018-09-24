'use strict'

let AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});

let myClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    let startDate = event.startDate;
    let endDate = event.endDate;
    let symbol = event.id; // event.pathParameters.id

    let startDateTS = (new Date(startDate).getTime()/1000).toString();
    let endDateTS = (new Date(endDate).getTime()/1000).toString();

    console.log("Fetching from table: " + process.env['TABLE_NAME'] + " Params: symbol=" + symbol + ", startDate=" + startDate + ", endDate=" + endDate);

    let params = {
        TableName : process.env['TABLE_NAME'],
        ExpressionAttributeNames: {
            "#ts":"timestamp",
            "#na":"name",
            "#so":"source",
            "#te":"text",
            "#ur":"url"
        },
        KeyConditionExpression: 'symbol = :sym and #ts between :start and :end',
        ProjectionExpression: '#ts, #na, #so, sentimentLabel, sentimentScore, #te, #ur',
        ExpressionAttributeValues: {
            ":sym":symbol,
            ":start":startDateTS,
            ":end":endDateTS
        }
    };

    myClient.query(params, function(err, data) {

        if (err){
            callback(err, null);
        } else {
            data = {
                "symbol": symbol,
                "start": startDate,
                "end": endDate,
                "news": data.Items
            }
            callback(null,  data);
        }
    });

}
