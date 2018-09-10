# stock-sentiment

In the world of investments, there are many things to take into consideration. Along with the normal metrics such as price and earnings, there are other factors that you need to make an informed decision, factors such as sentiments about a company. Sentiment is extremely hard to gauge as it's based on the news - and there exists a plethora of news sources. This tool aims to help with the noise and automatically assign a sentiment score and label based on news articles from selected, publicly available news articles and outlets.

# Description

Investing in the stock market can be tricky because there are many metrics to consider. Things like price, price-earnings ratios, alphas, price-to-book, and free cash flow are just a few of the factors to think about. There is also the qualitative data that comes from news sources. Data that can help you make investment decisions around a company's future value based on positive or negative news. To help you with these decisions, you can use the Watson Discovery pre-enriched news collection to keep track of various companies. With this code pattern as a guide, you can create a web app that lets you monitor, view sentiment information on, get links to news stories about, and track stock prices over time for companies you're interested in investing in.

# Architecture

The final solution will be composed of the below high level components

![10,000ft view](images/10000ft.png?raw=true "10,000 ft view")

## Crawler

The crawlers are custom pieces of code that have specific targets such as publicly available news websites (Seeking Alpha, Forbers, Reuters, Bloomberg etc.), Twitter, Facebook or other social media that identifies and ingests data. As most publicly available news sites have data in different formats it is likely that different crawlers will be needed per source of information.

## Database

Database that will hold all information. Likely a document noSQL DB for faster iteration.

## WebUI

Web interface to display the necessary information to the user.

## Notifications

(At a later stage) - users will be able to subscriber for notifications for sentiment changes etc.

## Sentiment Analysis

AI-as-a-Service platform to be used to analyze suggested data.

## Prediction Model

(At a later stage) - identify how positive news articles affect stock value

Detail on components 

![System components](/images/Components.png?raw=true "Solution Components")

These are some initial thoughts on components to create the necessary solution.


# Work so far

Implemented a crawler that provides sentiment analysis based on articles out of Seeking Alpha using IBM Watson.

![Screenshot](/images/SoFar.png?raw=true "Sentiment Analysis")

