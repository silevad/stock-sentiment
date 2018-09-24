function getAuthType() {
  var response = { type: 'NONE' };
  return response;
}

function getConfig(request) {
  var config = {
    configParams: [
        {
            type: 'INFO',
            name: 'instructions',
            text: 'Enter stock symbol to fetch sentiment analysis from multiple data sources.'
        },
        {
            type: 'TEXTINPUT',
            name: 'symbolName',
            displayName: 'Enter stock symbol name',
            helpText: 'e.g. GOOGL or MSFT...',
            placeholder: 'MSFT'
        }
    ],
    dateRangeRequired: true
  };
  return config;
}

var sentimentSchema = [
  {
    name: 'symbolName',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'sentimentScore',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      isReaggregatable: true
    },
    defaultAggregationType: 'SUM'
  },
  {
    name: 'timestamp',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION',
      semanticType: 'YEAR_MONTH_DAY'
    }
  }
];


function getSchema(request) {
  return { schema: sentimentSchema };
}

function getData(request) {

/*
  request = {
   configParams: {
     symbolName: 'MSFT'
   },
   dateRange: {
     endDate: '2018-09-13',
     startDate: '2018-09-12'
   },
   fields: [
     {
       name: 'symbolName',
     },
     {
       name: 'sentimentScore',
     },
     {
       name: 'timestamp'
     }
   ]
 }
*/


  // Create schema for requested fields
  var requestedSchema = request.fields.map(function (field) {
    for (var i = 0; i < sentimentSchema.length; i++) {
      if (sentimentSchema[i].name == field.name) {
        return sentimentSchema[i];
      }
    }
  });

  //'https://9l9aiedc8i.execute-api.eu-west-1.amazonaws.com/dev/symbol'

  // Fetch and parse data from API
  var url = [
    'https://wju4gdvh34.execute-api.eu-west-1.amazonaws.com/test/symbols/',
     request.configParams.symbolName,
    '?',
    'startDate=' + request.dateRange.startDate,
    '&',
    'endDate=' + request.dateRange.endDate
  ];

  var response = UrlFetchApp.fetch(url.join(''));
  var parsedResponse = JSON.parse(response).sentiments;


// Transform parsed data and filter for requested fields
  var requestedData = parsedResponse.map(function(newsSentiment) {
    var values = [];
    requestedSchema.forEach(function (field) {
      switch (field.name) {
        case 'timestamp':
          var dateStr = new Date(newsSentiment.timestamp*1000);
          values.push(dateStr.toISOString().split('T')[0].replace(/-/g, ''));
          break;
        case 'sentimentScore':
          values.push(parseFloat(newsSentiment.sentimentScore));
          break;
        case 'symbolName':
          values.push(request.configParams.symbolName);
          break;
        default:
          values.push('');
      }
    });
    return { values: values };
  });
  //({values:["MSFT", 0.855816, "20180912"]})
  return {
    schema: requestedSchema,
    rows: requestedData
  };
}
