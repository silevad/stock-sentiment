class Article:
	name = ""
	symbol = ""
	url = ""
	text = ""
	sentimentLabel = ""
	sentimentScore = ""
	source = ""

    # The class "constructor" - It's actually an initializer 
def __init__(self, name, symbol, url, text, sentimentLabel, sentimentScore, source):
        self.name = name
        self.symbol = symbol
        self.url = url
        self.text = text
        self.sentimentLabel = sentimentLabel
        self.sentimentScore = sentimentScore
        self.source = source

def create_Article(name, symbol, url, text, sentimentLabel, sentimentScore, source):
	article = Article(name, symbol, url, text, sentiment, sentimentScore, source)
	return article