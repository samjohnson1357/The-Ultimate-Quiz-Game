r"""
File Summary: This file exists to fill up the Score database table with lots of random data. This random data
can then be used to see what various pages will look like and help us with the design.

To run this code, run these commands:
    py manage.py shell
    exec(open(r'C:\Users\sacky\My Programs\Portfolio Projects\Quiz-Game-With-Leaderboard\main\insert_test_data.py').read())
"""

import random
import datetime as dt
import pandas as pd

from main import models

CATEGORIES_MAP = {
    "Music": "music", "Sport and leisure": "sport_and_leisure", "Film and TV": "film_and_tv",
    "Arts and literature": "arts_and_literature", "History": "history", "Society and culture": "society_and_culture",
    "Science": "science", "Geography": "geography", "Food and drink": "food_and_drink", "General knowledge": "general_knowledge"
}
DIFFICULTIES_MAP = { "Easy": "easy", "Medium": "medium", "Hard": "hard" }

def getBabyNames():
    nameArray = pd.read_csv('main/Baby Names.csv')['Name'].values
    nameArray = list(nameArray)
    random.shuffle(nameArray)
    return nameArray

def getRandomDateTime(startDt, endDt):
    timeDifference = endDt - startDt
    randomSeconds = random.randint(0, int(timeDifference.total_seconds()))
    randomDt = startDt + dt.timedelta(seconds=randomSeconds)
    return randomDt

def getRandomRecentDateTime():
    endDate = dt.datetime.now()
    startDate = endDate - dt.timedelta(days=100)
    return getRandomDateTime(startDate, endDate)

def getRandomNumberOfAttempts():
    return random.randint(5, 10)

def getRandomScore():
    return random.randint(0, 10)

def getRandomCategory():
    categories = list(CATEGORIES_MAP.keys())
    return random.choice(categories)

def getRandomDifficulty():
    difficulties = list(DIFFICULTIES_MAP.keys())
    return random.choice(difficulties)

def saveScoreRecord(username, dateTime, category, difficulty, score):
    scoreRecord = models.Score(
        username=username, 
        dateTime=dateTime, 
        category=category,
        difficulty=difficulty,
        score=score,
        )
    scoreRecord.save()

def saveTestData():
    names = getBabyNames()
    for name in names[0:200]:
        nAttempts = getRandomNumberOfAttempts()
        for _ in range(nAttempts):
            dateTime = getRandomRecentDateTime()
            category = getRandomCategory()
            difficulty = getRandomDifficulty()
            score = getRandomScore()
            saveScoreRecord(name, dateTime, category, difficulty, score)

def saveSackymottoTestData():
    for category in CATEGORIES_MAP.keys():
        for difficulty in DIFFICULTIES_MAP.keys():
            for _ in range(5):
                dateTime = getRandomRecentDateTime()
                score = getRandomScore()
                saveScoreRecord("sackymotto", dateTime, category, difficulty, score)

def deleteAllData():
    models.Score.objects.all().delete()

if __name__ == '__main__':
    # saveTestData()
    # saveSackymottoTestData()
    deleteAllData()

