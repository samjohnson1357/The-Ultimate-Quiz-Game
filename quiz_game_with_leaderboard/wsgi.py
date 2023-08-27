"""
WSGI config for quiz_game_with_leaderboard project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""



import os

from django.core.wsgi import get_wsgi_application

# importing whitenoise
from whitenoise import WhiteNoise

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "quiz_game_with_leaderboard.settings")

application = get_wsgi_application()

# wrapping up existing wsgi application
application = WhiteNoise(application, root="static")