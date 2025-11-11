from django.urls import path
from .views import health_check, generate_quiz_view

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("quizzes/generate/", generate_quiz_view, name="quiz-generate"),
]