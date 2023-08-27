from django.urls import path

from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('register-success/', views.registerSuccess, name='register-success'),
    path('logout/', views.logout, name='logout'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('personal-stats/', views.personalStats, name='personal-stats'),
    path('quiz-game/', views.quizGame, name='quiz-game'),
    path('help-page/', views.helpPage, name='help-page'),
    path('', views.login, name='home'),
    path('score-post-request/', views.respondToScorePostRequest, name='score-post-request'),
    path('score-get-request/', views.getScoreLeaderboardData, name='score-get-request'),
    path('personal-stats-get-request/', views.getPersonalStatsData, name='personal-stats-get-request')
]

