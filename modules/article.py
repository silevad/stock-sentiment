class Article:
    name = ""
    symbol = ""
    url = ""
    text = ""
    sentimentLabel = ""
    sentimentScore = ""
    source = ""
     
    def __init__(self, name, symbol, url, text, sentimentLabel, sentimentScore, source):
            self.name = name
            self.symbol = symbol
            self.url = url
            self.text = text
            self.sentimentLabel = sentimentLabel
            self.sentimentScore = sentimentScore
            self.source = source
    
    def __str__(self):
            return ', '.join(['{key}={value}'.format(key=key, value=self.__dict__.get(key)) for key in self.__dict__])
        
    def create_Article(name, symbol, url, text, sentimentLabel, sentimentScore, source):
        article = Article(name, symbol, url, text, sentimentLabel, sentimentScore, source)
        return article


if __name__ == '__main__':
    article1 = Article("Article1", "A1", "http://a1.com", "A1 news articles", "positive", 0.67, "A1 News")
    print(article1)
    
    article2 = Article.create_Article("Article2", "A2", "http://a2.com", "A2 news articles", "negative", 0.45, "A2 News")
    print(article2)
    