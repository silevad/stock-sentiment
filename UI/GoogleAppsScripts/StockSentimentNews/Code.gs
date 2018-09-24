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
            text: 'Enter stock symbol to fetch sentiment news from multiple data sources.'
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
    name: 'name',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'source',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'sentimentLabel',
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
      semanticType: 'NUMBER'
    }
  },
  {
    name: 'text',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'url',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION'
    }
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
     symbolName: 'GOOGL'
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
       name: 'name',
     },
     {
       name: 'source',
     },
     {
       name: 'sentimentLabel',
     },
     {
       name: 'sentimentScore',
     },
     {
       name: 'text',
     },
     {
       name: 'url',
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

  // Fetch and parse data from API
  var url = [
    'https://wju4gdvh34.execute-api.eu-west-1.amazonaws.com/test/symbols/',
     request.configParams.symbolName,
    '/',
    'news',
    '?',
    'startDate=' + request.dateRange.startDate,
    '&',
    'endDate=' + request.dateRange.endDate
  ];

  var response = UrlFetchApp.fetch(url.join(''));
  var parsedResponse = JSON.parse(response).news;


// Transform parsed data and filter for requested fields
  var requestedData = parsedResponse.map(function(news) {
    var values = [];
    requestedSchema.forEach(function (field) {
      switch (field.name) {
        case 'timestamp':
          var dateStr = new Date(news.timestamp*1000);
          values.push(dateStr.toISOString().split('T')[0].replace(/-/g, ''));
          break;
        case 'sentimentLabel':
          values.push(news.sentimentLabel);
          break;
        case 'sentimentScore':
          values.push(parseFloat(news.sentimentScore));
          break;
        case 'symbolName':
          values.push(request.configParams.symbolName);
          break;
        case 'name':
          values.push(news.name);
          break;
        case 'source':
          values.push(news.source);
          break;
        case 'text':
          values.push(news.text);
          break;
        case 'url':
          values.push(news.url);
          break;
        default:
          values.push('');
      }
    });
    return { values: values };
  });

  return {
    schema: requestedSchema,
    rows: requestedData
  };
}
