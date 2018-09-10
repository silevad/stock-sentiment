import requests
from bs4 import BeautifulSoup

headers = {
"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5)",
"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
"accept-charset": "cp1254,ISO-8859-9,utf-8;q=0.7,*;q=0.3",
"accept-encoding": "gzip,deflate,sdch",
"accept-language": "tr,tr-TR,en-US,en;q=0.8",
}

page = requests.get('https://seekingalpha.com/symbol/AAPL?s=aapl', headers=headers)

soup = BeautifulSoup(page.content, 'html.parser')


maza = soup.findAll('div',attrs={'class': 'symbol_article'})

urls = []
for h in soup.findAll('div',attrs={'class': 'symbol_article'}):
    a = h.find('a')
    urls.append(a.attrs['href'])


print(urls)	
