from django.contrib import admin
from .models import (
    Club,
    Season,
    Person,
    PersonClubSeason,
    StatsPersonClubSeason,
)

@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)

@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ("label",)
    search_fields = ("label",)

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "full_name")
    search_fields = ("first_name", "last_name")

class StatsPersonClubSeasonInline(admin.StackedInline):
    model = StatsPersonClubSeason
    extra = 0

@admin.register(PersonClubSeason)
class PersonClubSeasonAdmin(admin.ModelAdmin):
    list_display = ("person", "club", "season", "role")
    list_filter = ("club", "season", "role")
    search_fields = (
        "person__first_name",
        "person__last_name",
        "club__name",
    )
    inlines = [StatsPersonClubSeasonInline]

@admin.register(StatsPersonClubSeason)
class StatsPersonClubSeasonAdmin(admin.ModelAdmin):
    list_display = ("person_club_season", "appearances", "goals")
    search_fields = (
        "person_club_season__person__first_name",
        "person_club_season__person__last_name",
        "person_club_season__club__name",
    )