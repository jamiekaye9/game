from typing import Literal, TypedDict, List, Dict, Any
from django.db.models import Sum
from football.models import (
    Club,
    Season,
    Person,
    PersonClubSeason,
    StatsPersonClubSeason,
)


QuizMode = Literal["club", "season", "overall"]
QuizCategory = Literal["goals", "assists", "managers", "appearances"]

class QuizConfig(TypedDict, total=False):
    mode: QuizMode
    club_id: int
    season_id: int
    category: QuizCategory
    limit: int

def generate_quiz(config: QuizConfig) -> Dict[str, Any]:
    """
    Generates the list of correct answers based on mode (club/season/overall) and category (goals, assists, appearances, managers)
    """

    mode = config.get("mode", "club")
    category = config.get("category", "goals")
    limit = int(config.get("limit", 10) or 10)
    club_id = config.get("club_id")
    season_id = config.get("season_id")

    answers: List[Dict[str, Any]] = []
    max_answers = 0

    if category == 'managers' and mode == 'overall':
        return {
            'config': {
                'mode': mode,
                'category': category,
                'limit': limit,
                'club_id': club_id,
                'season_id': season_id,
            },
            'max_answers': 0,
            'answers': [],
            'error': 'Managers quiz is only available for club or season mode.'
        }

    if category == 'goals':
        qs = StatsPersonClubSeason.objects.select_related(
            "person_club_season__person",
            "person_club_season__club",
            "person_club_season__season",
        ).filter(goals__gt=0)

        if mode == 'club' and club_id:
            qs = qs.filter(person_club_season__club_id=club_id)
        elif mode == 'season' and season_id:
            qs = qs.filter(person_club_season__season_id=season_id)
        
        agg = (
            qs.values(
                'person_club_season__person_id',
                'person_club_season__person__first_name',
                'person_club_season__person__last_name',
                'person_club_season__club__name',
            )
            .annotate(total_goals=Sum('goals'))
            .order_by('-total_goals', 'person_club_season__person__last_name')
        )

        max_answers = agg.count()

        for row in agg[:limit]:
            full_name = f"{row['person_club_season__person__first_name']} {row['person_club_season__person__last_name']}"
            answers.append({
                'id': row['person_club_season__person_id'],
                'name': full_name.strip(),
                'first_name': row['person_club_season__person__first_name'],
                'last_name': row['person_club_season__person__last_name'],
                'club': row.get('person_club_season__club__name'),
                'total_goals': row['total_goals'],
            })
    
    elif category == 'assists':
        qs = StatsPersonClubSeason.objects.select_related(
            'person_club_season__person',
            'person_club_season__club',
            'person_club_season__season',
        ).filter(assists__gt=0)

        if mode == 'club' and club_id:
            qs = qs.filter(person_club_season__club_id=club_id)
        elif mode == 'season' and season_id:
            qs = qs.filter(person_club_season__season_id=season_id)
        
        agg = (
            qs.values(
                'person_club_season__person_id',
                'person_club_season__person__first_name',
                'person_club_season__person__last_name',
                'person_club_season__club__name',
            )
            .annotate(total_assists=Sum('assists'))
            .order_by('-total_assists', 'person_club_season__person__last_name')
        )
    
        max_answers = agg.count()

        for row in agg[:limit]:
            full_name = f"{row['person_club_season__person__first_name']} {row['person_club_season__person__last_name']}"
            answers.append({
                'id': row['person_club_season__person_id'],
                'name': full_name.strip(),
                'first_name': row['person_club_season__person__first_name'],
                'last_name': row['person_club_season__person__last_name'],
                'club': row.get('person_club_season__club__name'),
                'total_assists': row['total_assists'],
            })
    
    elif category == 'appearances':
        qs = StatsPersonClubSeason.objects.select_related(
            'person_club_season__person',
            'person_club_season__club',
            'person_club_season__season',
        ).filter(appearances__gt=0)
        
        if mode == 'club' and club_id:
            qs = qs.filter(person_club_season__club_id=club_id)
        elif mode == 'season' and season_id:
            qs = qs.filter(person_club_season__season_id=season_id)
        
        agg = (
            qs.values(
                'person_club_season__person_id',
                'person_club_season__person__first_name',
                'person_club_season__person__last_name',
                'person_club_season__club__name',
            )
            .annotate(total_appearances=Sum('appearances'))
            .order_by('-total_appearances', 'person_club_season__person__last_name')
        )
        
        max_answers = agg.count()

        for row in agg[:limit]:
            full_name = f"{row['person_club_season__person__first_name']} {row['person_club_season__person__last_name']}"
            answers.append({
                    'id': row['person_club_season__person_id'],
                    'name': full_name.strip(),
                    'first_name': row['person_club_season__person__first_name'],
                    'last_name': row['person_club_season__person__last_name'],
                    'club': row.get('person_club_season__club__name'),
                    'total_appearances': row['total_appearances'],
                })
    
    elif category == 'managers':
        qs = PersonClubSeason.objects.select_related(
            'person',
            'club',
            'season',
        ).filter(role__iexact='manager')

        if mode == 'club' and club_id:
            qs = qs.filter(club_id=club_id)
        elif mode == 'season' and season_id:
            qs = qs.filter(season_id=season_id)
        
        manager_rows = (
            qs.values(
                'person_id',
                'person__first_name',
                'person__last_name',
            )
            .distinct()
            .order_by('person__last_name', 'person__first_name')
        )

        max_answers = manager_rows.count()

        for row in manager_rows[:limit]:
            full_name = f"{row['person__first_name']} {row['person__last_name']}"
            answers.append({
                'id': row['person_id'],
                'name': full_name.strip(),
                'first_name': row['person__first_name'],
                'last_name': row['person__last_name'],
            })

    return {
        "config": {
            "mode": mode,
            "category": category,
            "limit": limit,
            "club_id": club_id,
            "season_id": season_id,
        },
        'max_answers': max_answers,
        "answers": answers,
    }