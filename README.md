# Football Quiz Game

A Sporcle-style Premier League quiz built using **Django REST Framework, React and PostgreSQL**. Players choose a club, season and quiz category (goals, assists, appearances or managers) and try to guess every correct answer. Answers are checked in real-time during the game.

---

## Features

- Django API + React frontend + PostgreSQL database
- Dynamically generated quizzes
- CSV import command to bulk-load season stats
- Real-time answer validation and scoring
- Supports multiple quiz types (goals, assists, appearances, managers)

---

## Tech Stack

### Backend
- Django REST Framework
- PostgreSQL
- Custom relational models for Person, Club, Season, Stats

### Frontend
- React + Vite
- Bootstrap
- React hooks for state and UI updates

---

## Data Model Overview

The project uses a relational structure to support querying real stats:

- **Person** → player or manager  
- **Club** + **Season**  
- **PersonClubSeason** → links a player/manager to a club + season  
- **StatsPersonClubSeason** → appearances, goals and assists  

Example quiz:
> Top goalscorers in the 2024/25 season?
