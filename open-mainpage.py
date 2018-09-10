# open-webpage.py
from urllib.request import urlopen
from bs4 import BeautifulSoup



url = 'https://seekingalpha.com/symbol/AAPL?s=aapl'

html = urlopen(url)


print(html.read())
