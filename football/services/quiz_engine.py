from typing import Literal, TypedDict, List, Dict, Any

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
    Placeholder quiz generator.
    Returns a fake quiz payload based on the provided config
    """

    mode = config.get("mode", "club")
    category = config.get("category", "goals")
    limit = config.get("limit", 10)

    # Fake data
    dummy_answers: List[Dict[str, Any]] = [
        {'id': 1, 'name': 'Dummy Player 1'},
        {'id': 2, 'name': 'Dummy Player 2'},
        {'id': 3, 'name': 'Dummy Player 3'},
    ] [:limit]

    return {
        "config": {
            "mode": mode,
            "category": category,
            "limit": limit,
            "club_id": config.get("club_id"),
            "season_id": config.get("season_id"),
        },
        "answers": dummy_answers,
    }