import tweepy #run this command in cmd. pip install tweepy
import sys
import os
import jsonpickle #pip install jsonpickle

auth = tweepy.AppAuthHandler("qoStboHQJiO4oUzRYfDsUi7YM", "NzoUwyWkTp20EPTuv333piZxKJWLWpNwi54Xgjxr0BQRB9x2vh") #change this to your own authenticator

api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)

if (not api):
    print ("Cant authenticate")
    sys.exit(-1)

searchQuery = 'new york' #enter the search query here
language = 'en'
maxTweets = 50  #Maximum number of tweets to collect
tweetsPerQry = 10
fName = 'tweets.json'

sinceId = None

flagFirst = False
flagLast = False

print('Are you creating a new file for the first time? (y/n) Default: n')
if(input() == 'y'): flagFirst = True
else:
    print('Is this the last file update? (y/n) Default: n')
    if(input() == 'y'): flagLast = True

# If results only below a specific ID are, set max_id to that ID.
# else default to no upper limit, start from the most recent tweet matching the search query.
max_id = -1

tweetCount = 0
print("Downloading max {0} tweets".format(maxTweets))
with open(fName, 'a') as f:
    if(flagFirst):
        f.write('[\n')
    while tweetCount < maxTweets:
        try:
            if (max_id <= 0):
                if (not sinceId):
                    new_tweets = api.search(q=searchQuery, lang=language, count=tweetsPerQry)
                else:
                    new_tweets = api.search(q=searchQuery, lang=language, count=tweetsPerQry,
                                            since_id=sinceId)
            else:
                if (not sinceId):
                    new_tweets = api.search(q=searchQuery, lang=language, count=tweetsPerQry,
                                            max_id=str(max_id - 1))
                else:
                    new_tweets = api.search(q=searchQuery, lang=language, count=tweetsPerQry,
                                            max_id=str(max_id - 1),
                                            since_id=sinceId)
            if not new_tweets:
                print("No more tweets found")
                break
            count = 0
            tweetCount += len(new_tweets)
            for tweet in new_tweets:
                if ((count+1 == len(new_tweets)) and flagLast and tweetCount >= maxTweets):
                    f.write(jsonpickle.encode(tweet._json, unpicklable=False) + '\n]')
                else:
                    f.write(jsonpickle.encode(tweet._json, unpicklable=False) +
                    ',\n')
                count += 1
            print("Downloaded {0} tweets".format(tweetCount))
            max_id = new_tweets[-1].id
        except tweepy.TweepError as e:
            # Just exit if any error
            print("some error : " + str(e))
            break
    f.close()

print ("Downloaded {0} tweets, Saved to {1}".format(tweetCount, fName))