import json
import jsonpickle
import preprocessor as tpp #pip install tweet-preprocessor #if it causes an error text me
import os
import sys

with open('tweets.json', 'r') as jsonFile:
    tweets = json.load(jsonFile)

enviornment = ['enviornment', 'air', 'flood', 'drought', 'rain', 'storm',
'smog', 'snow', 'animal', 'tree', 'polluted', 'pollution']
crime = ['crime', 'murder', 'theft', 'arson', 'cartel','police', 'shooting', 'drug', 'bust',
'rape', 'terrorist']
politics = ['politics', 'politic', 'election', 'democracy']
infrastructure = ['metro', 'road', 'sanitation', 'electricity', 'power', 'water']
socialUnrest = ['strike', 'protest', 'riot']

nyc = ['nyc', 'new york city']
mexico = ['mexico', 'mexico city']

months = {
    'Jan':'1',
    'Feb':'2',
    'Mar':'3',
    'Apr':'4',
    'May':'5',
    'Jun':'6',
    'Jul':'7',
    'Aug':'8',
    'Sep':'9',
    'Oct':'10',
    'Nov':'11',
    'Dec':'12'
}

for tweet in tweets:
    tweetText = tweet['text']
    #tweetText = tweetTextTemp.encode('ascii', 'replace').lower()
    parsedTweet = tpp.parse(tweetText)
    tweetLang = tweet['lang']
    tweetDate = tweet['created_at']
    tweetCoordinates = ''
    tweetHashTags = ''
    tweetMentions = ''
    tweetEmoticons = ''
    tweetUrls = ''
    tweetTopic = 'crime'
    tweetCity = 'nyc'

    splitTime = tweetDate.split()
    month = months[splitTime[1]]
    year = splitTime[5]
    day = splitTime[2]
    time = splitTime[3].split(':')[0]+':00:00'
    tweetDate = year + '-' + month + '-' + day + 'T' + time +'Z'
    try:
        for temp in parsedTweet.hashtags:
            tweetHashTags = tweetHashTags + temp.match + ' '
        tweetHashTags = tweetHashTags.replace('#', '').strip(' ')
    except TypeError as te:
        tweetHashTags = ''
    try:
        for temp in parsedTweet.mentions:
            tweetMentions = tweetMentions + temp.match + ' '
        tweetMentions = tweetMentions.replace('@', '').strip(' ')
    except TypeError as te:
        tweetMentions = ''
    try:
        for temp in parsedTweet.urls:
            tweetUrls = tweetUrls + temp.match + ' '
        tweetUrls = tweetUrls.strip(' ')
    except TypeError as te:
        tweetUrls = ''
    try:
        for temp in parsedTweet.emojis:
            tweetEmoticons = tweetEmoticons + temp.match + ' '
    except TypeError as te:
        tweetEmoticons = ''
    try:
        for temp in parsedTweet.smileys:
            tweetEmoticons = tweetEmoticons + temp.match + ' '
        tweetEmoticons = tweetEmoticons.strip(' ')
    except TypeError as te:
        tweetEmoticons = ''

    if any(word in tweetText for word in nyc):
        tweetCity = 'nyc'
    if any(word in tweetText for word in mexico):
        tweetCity = 'mexico city'
    if 'delhi' in tweetText:
        tweetCity = 'delhi'
    if 'bangkok' in tweetText:
        tweetCity = 'bangkok'
    if 'paris' in tweetText:
        tweetCity = 'paris'

    if any(word in tweetText for word in enviornment):
        tweetTopic = 'enviornment'
    elif any(word in tweetText for word in crime):
        tweetTopic = 'crime'
    elif any(word in tweetText for word in socialUnrest):
        tweetTopic = 'social unrest'
    elif any(word in tweetText for word in infrastructure):
        tweetTopic = 'infra'
    elif any(word in tweetText for word in politics):
        tweetTopic = 'politics'
    tweet.clear()
    tweet['topic'] = tweetTopic
    tweet['city'] = tweetCity
    tweet['tweet_text'] = tweetText
    tweet['tweet_lang'] = tweetLang
    tweet['hashtags'] = tweetHashTags
    tweet['mentions'] = tweetMentions
    tweet['tweet_urls'] = tweetUrls
    tweet['tweet_emoticons'] = tweetEmoticons
    tweet['tweet_date'] = tweetDate
    tweet['tweet_loc'] = tweetCoordinates

with open('processedTweet.json', 'w') as f:
    json.dump(tweets, f)

#print tweetTopic
#print tweetCity
#print tweetText
#print tweetLang
#print tweetHashTags
#print tweetMentions
#print tweetUrls
#print tweetEmoticons
#print tweetDate
#print tweetCoordinates