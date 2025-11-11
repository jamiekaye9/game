from django.urls import path
from .views import health_check, generate_quiz_view, list_clubs, list_seasons

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("quizzes/generate/", generate_quiz_view, name="quiz-generate"),
    path("clubs/", list_clubs, name='list_clubs'),
    path("seasons/", list_seasons, name='list_seasons'),
]