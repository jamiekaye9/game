from rest_framework import serializers
from .models import (
    Club,
    Season,
    Person,
    PersonClubSeason,
    StatsPersonClubSeason,
)

class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ("id", "name")

class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = ("id", "label")

class PersonSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='full_name', read_only=True)

    class Meta:
        model = Club
        fields = ("id", "first_name", "last_name", "full_name")

class StatsPersonClubSeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatsPersonClubSeason
        fields = ("appearances", "goals", "assists")

class PersonClubSeasonSerializer(serializers.ModelSerializer):
    person = PersonSerializer(read_only=True)
    club = ClubSerializer(read_only=True)
    season = SeasonSerializer(read_only=True)
    stats = StatsPersonClubSeasonSerializer(read_only=True)

    class Meta:
        model = PersonClubSeason
        fields = ("id", "person", "club", "season", "role", "stats")