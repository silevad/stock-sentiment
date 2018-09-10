from __future__ import print_function
import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 import Features, EntitiesOptions, KeywordsOptions, SentimentOptions


natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2017-02-27',
    ## url is optional, and defaults to the URL below. Use the correct URL for your region.
    # url='https://gateway.watsonplatform.net/natural-language-understanding/api',
    username='e024a6a9-fa8a-4338-98c6-72aa2eaab5a2',
    password='tUAdxOe0XMBI')

## If service instance provides API key authentication
# natural_language_understanding = NaturalLanguageUnderstandingV1(
#     version='2018-03-19',
#     ## url is optional, and defaults to the URL below. Use the correct URL for your region.
#     url='https://gateway.watsonplatform.net/natural-language-understanding/api',
#     iam_api_key='your_api_key')

response = natural_language_understanding.analyze(
    text='Microsoft is undervalued. Period., Its cloud potential is not being sufficiently priced in by investors., Balance sheet creates a safety net for investors.',
    features=Features(sentiment=SentimentOptions(), entities=EntitiesOptions(sentiment=True), keywords=KeywordsOptions()))

print(json.dumps(response, indent=2))
