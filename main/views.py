
# Django imports
from django.shortcuts import render, redirect
from django.contrib import auth
from django import http

# Local imports
from . import forms
from . import models

# Python package imports
import json
import datetime as dt
import traceback

CATEGORIES = ["Music", "Sport and leisure", "Film and TV", "Arts and literature", "History", "Society and culture", 
              "Science", "Geography", "Food and drink", "General knowledge"]
DIFFICULTIES = ["Easy", "Medium", "Hard"]

def addLoggedInItemToContext(request, context):
    if request.user.is_authenticated:
        context['is_logged_in'] = True
    else:
        context['is_logged_in'] = False

def register(request):
    # This is the case where the user is already logged in, but goes to the register link anyways.
    if request.user.is_authenticated:
        return redirect('/quiz-game/')

    # This is the case where the user clicks the submit button after filling out the form.
    if request.method == 'POST':
        form = forms.UserRegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            if not auth.models.User.objects.filter(username=username).exists():
                auth.models.User.objects.create_user(username=username, password=password)
                # Auto-login the user
                user = auth.authenticate(request, username=username, password=password)
                auth.login(request, user)
                # Redirect to the success page after registration and login
                return redirect('/register-success/')

            else:
                error_message = "Username already exists. Please choose a different username."
                context = {'form': form, 'error_message': error_message}
                addLoggedInItemToContext(request, context)
                return render(request, 'register.html', context)

    # This is the case where we return an empty form to the user.
    else:
        form = forms.UserRegistrationForm()

    context = {'form': form}
    addLoggedInItemToContext(request, context)
    return render(request, 'register.html', context)

def login(request):
    # This is the case where the user is already logged in, but goes to the login link anyways.
    if request.user.is_authenticated:
        return redirect('/quiz-game/')

    # This is the case for when the user submits the form.
    if request.method == 'POST':
        form = forms.UserLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = auth.authenticate(request, username=username, password=password)

            # Log the user in and go to the quiz game.
            if user is not None:
                auth.login(request, user)
                return redirect('/quiz-game/')

            # Display an error message indicating invalid credentials.
            else:
                context = {'form': form, 'error_message': "Invalid username or password. Please try again."}
                addLoggedInItemToContext(request, context)
                return render(request, 'login.html', context)

    # This is the case for when the user is requesting to see the form for the first time.
    else:
        form = forms.UserLoginForm()

    context = {'form': form}
    addLoggedInItemToContext(request, context)
    return render(request, 'login.html', context)

def registerSuccess(request):
    context = {}
    addLoggedInItemToContext(request, context)
    return render(request, 'register_success.html', context)

def logout(request):
    auth.logout(request)
    return redirect('/quiz-game/')

def home(request):
    try:
        context = {}
        addLoggedInItemToContext(request, context)
        return render(request, 'base.html', context)
    except:
        traceback.print_exc()

def personalStats(request):
    if request.user.is_authenticated:
        context = {'categories':CATEGORIES, 'difficulties':DIFFICULTIES}
        addLoggedInItemToContext(request, context)
        return render(request, 'personal_stats.html', context)
    else:
        context = {}
        addLoggedInItemToContext(request, context)
        return render(request, 'personal_stats_not_logged_in.html', context)
    
def getPersonalStatsData(request):
    if not request.user.is_authenticated:
        return http.JsonResponse({'authenticated':'false'})
    
    category = request.GET.get("category")
    difficulty = request.GET.get("difficulty")
    username = request.user.username
    scoreObjects = models.Score.objects.filter(category=category, difficulty=difficulty, username=username).order_by('dateTime')

    dateTimes = []
    scores = []
    for scoreObj in scoreObjects:
        dateTimes.append(scoreObj.dateTime)
        scores.append(scoreObj.score)

    return http.JsonResponse({'authenticated':'true', 'dateTimes':dateTimes, 'scores':scores})

def leaderboard(request):
    try:
        context = {'categories':CATEGORIES, 'difficulties':DIFFICULTIES}
        addLoggedInItemToContext(request, context)
        return render(request, 'leaderboard.html', context)
    except Exception:
        traceback.print_exc()
        return http.JsonResponse({'status':'failure'})

def getScoreLeaderboardData(request):
    try:
        # Retrieve the username so that this user's scores can be highlighted on the leaderboard.
        username = request.user.username if request.user.is_authenticated else ''

        # Retrieve the score data.
        category = request.GET.get("category")
        difficulty = request.GET.get("difficulty")
        scores = models.Score.objects.filter(category=category, difficulty=difficulty).order_by('-score', '-dateTime')[:100]
        scores = list(scores.values())  # Convert the QuerySet to a list of dictionaries
        return http.JsonResponse({'scores':scores, 'username':username})

    except Exception:
        traceback.print_exc()
        return http.JsonResponse({'status':'failure'})

def quizGame(request):
    try:
        context = {'categories':CATEGORIES, 'difficulties':DIFFICULTIES}
        addLoggedInItemToContext(request, context)
        return render(request, 'quiz_game.html', context)
    except:
        traceback.print_exc()

def helpPage(request):
    context = {}
    addLoggedInItemToContext(request, context)
    return render(request, 'help_page.html', context)

def respondToScorePostRequest(request):
    if not request.user.is_authenticated:
        print('User is not authenticated')
        return http.HttpResponseBadRequest()
    try:
        data = json.loads(request.body)
        obj = models.Score(
            username=request.user.username, 
            dateTime=dt.datetime.now(), 
            category=data.get('category'),
            difficulty=data.get('difficulty'),
            score=data.get('score'),
            )
        obj.save()
        return http.JsonResponse({'status': 'success', 'message': 'Data saved successfully.'})
    except Exception as e:
        traceback.print_exc()
        print(e)
        return http.HttpResponseServerError()

