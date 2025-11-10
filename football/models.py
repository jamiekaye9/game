from django.db import models

class Club(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Season(models.Model):
    label = models.CharField(max_length=9, unique=True)

    def __str__(self):
        return self.label

class Person(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.full_name

class PersonClubSeason(models.Model):
    ROLE_PLAYER = 'player'
    ROLE_MANAGER = 'manager'

    ROLE_CHOICES = [
        (ROLE_PLAYER, 'Player'),
        (ROLE_MANAGER, 'Manager'),
    ]

    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    class Meta:
        unique_together = ('person', 'club', 'season', 'role')

    def __str__(self):
        return f"{self.person.full_name} - {self.club.name} - {self.season.label} ({self.role})"

class StatsPersonClubSeason(models.Model):
    person_club_season = models.OneToOneField(
        PersonClubSeason,
        on_delete=models.CASCADE,
        related_name='stats'
    )
    appearances = models.PositiveIntegerField(default=0)
    goals = models.PositiveIntegerField(default=0)
    assists = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Stats for {self.person_club_season}"