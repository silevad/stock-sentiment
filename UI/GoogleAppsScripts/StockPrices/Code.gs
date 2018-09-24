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

var priceSchema = [
  {
    name: 'symbolName',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'price',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER',
      isReaggregatable: true
    },
    defaultAggregationType: 'SUM'
  },
  {
    name: 'volume',
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
  return { schema: priceSchema };
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
       name: 'price',
     },
     {
       name: 'volume',
     },
     {
       name: 'timestamp'
     }
   ]
 }
*/

  // Create schema for requested fields
  var requestedSchema = request.fields.map(function (field) {
    for (var i = 0; i < priceSchema.length; i++) {
      if (priceSchema[i].name == field.name) {
        return priceSchema[i];
      }
    }
  });

  // Fetch and parse data from API
  var url = [
    'https://wju4gdvh34.execute-api.eu-west-1.amazonaws.com/test/symbols/',
     request.configParams.symbolName,
    '/',
    'prices',
    '?',
    'startDate=' + request.dateRange.startDate,
    '&',
    'endDate=' + request.dateRange.endDate
  ];

  var response = UrlFetchApp.fetch(url.join(''));
  var parsedResponse = JSON.parse(response).stocks;

  var requestedData = parsedResponse.map(function(stock) {
    var values = [];
    requestedSchema.forEach(function (field) {
      switch (field.name) {
        case 'timestamp':
          var dateStr = new Date(stock.timestamp*1000);
          values.push(dateStr.toISOString().split('T')[0].replace(/-/g, ''));
          break;
        case 'symbolName':
          values.push(request.configParams.symbolName);
          break;
        case 'price':
          values.push(parseFloat(stock.price));
          break;
        case 'volume':
          values.push(parseFloat(stock.volume));
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
