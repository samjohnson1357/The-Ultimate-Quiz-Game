"""
Notes: 
This link helps with resolving common database issues: 
https://stackoverflow.com/questions/34548768/no-such-table-exception
This command seems to help: manage.py migrate --run-syncdb
"""

from django.db import models

class Score(models.Model):
    username = models.CharField(max_length=50)
    dateTime = models.DateTimeField()
    category = models.CharField(max_length=30)
    difficulty = models.CharField(max_length=30)
    score = models.SmallIntegerField()

    def __str__(self):
        return '{} - {} - {} - {} - {}'.format(self.username, self.dateTime.date(), self.category, self.difficulty, self.score)

    # class Meta:
    #     verbose_name_plural = "Scores"

    # class Meta:
    #     indexes = [
    #         models.Index(fields=["username", "category", "difficulty"]), # For the user plots
    #         models.Index(fields=["category, difficulty"])  # For the leaderboard
    #         ]

