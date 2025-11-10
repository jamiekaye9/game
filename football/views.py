from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def health_check(request):
    """
    Simple health check endpoint for monitoring / frontend.
    Returns JSON: {"status": "ok"} if the API is running.
    """
    return Response({"status": "ok"})