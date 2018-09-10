from __future__ import print_function
import time
import random
import pickle
import re
import boto3
import json
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 import Features, EntitiesOptions, KeywordsOptions, SentimentOptions
from modules.article import Article

#set options for headless firefox to see what happens
#options = Options()
#options.set_headless(headless=True)

def save_obj(obj, name ):
    with open('obj/'+ name + '.pkl', 'wb+') as f:
        pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)

def load_obj(name ):
    with open('obj/' + name + '.pkl', 'rb') as f:
        return pickle.load(f)

tag_re = re.compile(r'(<!--.*?-->|<[^>]*>)')

#deprecated, from using requests
headers = {
"user-agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_'+str(random.randint(0,20))+'_'+str(random.randint(0,10))+') AppleWebKit/'+str(random.randint(500,590))+'.36 (KHTML, like Gecko) Chrome/39.0.'+str(random.randint(1000,3000))+'.95 Safari/537.36',
"accept-charset": "cp1254,ISO-8859-9,utf-8;q=0.7,*;q=0.3",
"accept-encoding": "gzip,deflate,sdch",
"accept-language": "tr,tr-TR,en-US,en;q=0.8",
}

#setup Watson bluemix
natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2018-03-19',
    ## url is optional, and defaults to the URL below. Use the correct URL for your region.
    # url='https://gateway.watsonplatform.net/natural-language-understanding/api',
    username='9cfef0b7-12a1-460e-b981-6b0d0bb9158b',
    password='Mi8ulBahcsgF')


#request the seekingalpha page with the proper stock symbol
#page = requests.get('https://seekingalpha.com/symbol/MSFT?s=msft', headers=headers)
#this is quite slow, but unforutnately most public datasources protect against scraping so we need to pretend that we are a real browser.
driver = webdriver.Firefox()
driver.set_window_size(1920, 1080)
driver.get("https://seekingalpha.com/symbol/MSFT?s=msft")
html = driver.page_source

soup = BeautifulSoup(html, 'html.parser')

maza = soup.findAll('div',attrs={'class': 'symbol_article'})

urls = []
for h in soup.findAll('div',attrs={'class': 'symbol_article'}):
    a = h.find('a')
    urls.append(a.attrs['href'])


completeUrls = []
for url in urls:
	if  'http' in url:
		url=url
	else:
		url = "https://seekingalpha.com"+url

	completeUrls.append(url)


#print(completeUrls)

time.sleep(2)

data = {}
loopCounter = 0

for url in completeUrls:
	driver.get(url)
	html = driver.page_source
	#page = requests.get(url, headers=headers)
	soup = BeautifulSoup(html, 'html.parser')

	#soupText = BeautifulSoup(html, 'html.parser')
	#text = soupText.get_text()
	#print(text)

	#print(page.content)
	
	time.sleep(4)

	summary = []
	#extract the summary div
	for div in soup.findAll('div',attrs={'class': 'a-sum'}):
		text = div.findAll('p')
		#print(text)

#cast to text needed, but I dont understand Python enough to know why
	text = str(text)
	text = tag_re.sub('', text)
#silly check to ensure that article at least mentions microsoft
	if 'Microsoft' in text:
		data[url] = text
	elif 'MSFT' in text:
		data[url] = text
	else:
		print("Microsoft / MSFT not found in article")
		print(text)
	#break loop, for quicker testing

	if loopCounter >= 3:
		break

	loopCounter += 1

	#comprehend = boto3.client(service_name='comprehend', region_name='eu-west-1')

	print ("Text to be tested for sentiment")
	print(text)
	
	#print(json.dumps(comprehend.detect_sentiment(Text=text, LanguageCode='en'), sort_keys=True, indent=4))
	

	print('Calling DetectSentiment\n')
	response = natural_language_understanding.analyze(
    text=text,
    features=Features(sentiment=SentimentOptions(), entities=EntitiesOptions(sentiment=True), keywords=KeywordsOptions()))

	print(json.dumps(response, indent=2))
	print('End of DetectSentiment\n')

	#reply = json.loads(response);

	sentimentScore = response['sentiment']['document']['score']
	sentimentLabel = response['sentiment']['document']['label']

	print(str(sentimentScore) + '\n')
	print(str(sentimentLabel) + '\n')


	#break
	#print(data)
	#create_Article

save_obj(data, "msftdata")

driver.quit() 


