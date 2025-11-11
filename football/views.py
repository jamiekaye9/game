from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services.quiz_engine import generate_quiz
from .models import Club, Season
from .serializers import ClubSerializer, SeasonSerializer

@api_view(['GET'])
def list_clubs(request):
    clubs = Club.objects.order_by('name')
    serializer = ClubSerializer(clubs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def list_seasons(request):
    seasons = Season.objects.order_by("label")
    serializer = SeasonSerializer(seasons, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def health_check(request):
    """
    Simple health check endpoint for monitoring / frontend.
    Returns JSON: {"status": "ok"} if the API is running.
    """
    return Response({"status": "ok"})

@api_view(["POST"])
def generate_quiz_view(request):
    """
    Stub endpoint to generate a quiz based on POSTed config.
    Currently uses dummy data from services.quiz_engine.generate_quiz.
    Expected JSON body (example):
    {
       "mode": "club",
       "club_id": 1,
       "category": "goals",
       "limit": 10
    }
    """
    config = request.data or {}
    quiz = generate_quiz(config)
    return Response(quiz)