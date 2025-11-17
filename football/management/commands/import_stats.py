import csv

from django.core.management.base import BaseCommand, CommandError

from football.models import (
    Club,
    Season,
    Person,
    PersonClubSeason,
    StatsPersonClubSeason,
)


class Command(BaseCommand):
    help = "Import season/club/person stats from a CSV file."

    def add_arguments(self, parser):
        """
        Usage:
            python manage.py import_stats path/to/file.csv
        """
        parser.add_argument("csv_path", type=str, help="Path to the CSV file")

    def handle(self, *args, **options):
        csv_path = options["csv_path"]

        try:
            with open(csv_path, newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                self.import_rows(reader)
        except FileNotFoundError:
            raise CommandError(f"File not found: {csv_path}")

    def import_rows(self, reader):
        """
        Loop over each row in the CSV and import data according to strict rules:

        - Never auto-match people by name.
        - If person_id is given, it must match an existing Person.id.
        - If person_id is empty, we always create a new Person.
        """
        row_num = 1  # header line

        for row in reader:
            row_num += 1

            # 1. Read and clean values from CSV
            person_id_raw = (row.get("person_id") or "").strip()
            first_name = (row.get("first_name") or "").strip()
            last_name = (row.get("last_name") or "").strip()
            season_label = (row.get("season_label") or "").strip()
            club_name = (row.get("club_name") or "").strip()
            role = (row.get("role") or "").strip().lower()
            appearances = self.to_int(row.get("appearances"))
            goals = self.to_int(row.get("goals"))
            assists = self.to_int(row.get("assists"))

            # 2. Basic validation for required fields
            if not season_label or not club_name or not role:
                self.stdout.write(
                    f"Row {row_num}: missing season_label/club_name/role, skipping."
                )
                continue

            if not person_id_raw and not (first_name or last_name):
                self.stdout.write(
                    f"Row {row_num}: no person_id and no name, skipping."
                )
                continue

            # 3. Season: get or create by label
            season, _ = Season.objects.get_or_create(label=season_label)

            # 4. Club: get or create by name
            club, _ = Club.objects.get_or_create(name=club_name)

            # 5. Person: resolve using strict rules
            person = self.resolve_person(
                row_num=row_num,
                person_id_raw=person_id_raw,
                first_name=first_name,
                last_name=last_name,
            )

            if not person:
                # If resolve_person returned None, we skip this row.
                continue

            # 6. PersonClubSeason: link person+club+season+role
            pcs, _ = PersonClubSeason.objects.get_or_create(
                person=person,
                club=club,
                season=season,
                role=role,
            )

            # 7. If it's a player, update stats
            if role == "player":
                self.update_stats(
                    row_num=row_num,
                    pcs=pcs,
                    appearances=appearances,
                    goals=goals,
                    assists=assists,
                )

        self.stdout.write(self.style.SUCCESS("Import complete."))

    def to_int(self, value):
        """
        Safely convert CSV cell to int.
        Empty or invalid -> 0.
        """
        try:
            return int(value)
        except (TypeError, ValueError):
            return 0

    def resolve_person(self, row_num, person_id_raw, first_name, last_name):
        """
        Strict person resolution rules:

        - If person_id is provided:
            -> Must match an existing Person.id.
            -> If not found: skip row.
        - If person_id is empty:
            -> Always create a new Person with given name.
            -> Never auto-match by name.
        """

        # Case 1: person_id provided -> must exist
        if person_id_raw:
            try:
                person_id = int(person_id_raw)
            except ValueError:
                self.stdout.write(
                    f"Row {row_num}: invalid person_id '{person_id_raw}', skipping."
                )
                return None

            try:
                person = Person.objects.get(id=person_id)
                return person
            except Person.DoesNotExist:
                self.stdout.write(
                    f"Row {row_num}: no Person with id={person_id}, skipping."
                )
                return None

        # Case 2: no person_id -> create new Person
        if not first_name and not last_name:
            self.stdout.write(
                f"Row {row_num}: no person_id and no name, skipping."
            )
            return None

        person = Person.objects.create(
            first_name=first_name or "",
            last_name=last_name or "",
        )
        self.stdout.write(
            f"Row {row_num}: created new Person id={person.id} for '{first_name} {last_name}'."
        )
        return person

    def update_stats(self, row_num, pcs, appearances, goals, assists):
        """
        Create or update StatsPersonClubSeason for this PersonClubSeason.
        Currently overwrites values from CSV.
        """
        stats, created = StatsPersonClubSeason.objects.get_or_create(
            person_club_season=pcs,
            defaults={
                "appearances": appearances,
                "goals": goals,
                "assists": assists,
            },
        )

        if created:
            self.stdout.write(
                f"Row {row_num}: created stats for {pcs.person} at {pcs.club} in {pcs.season}."
            )
        else:
            stats.appearances = appearances
            stats.goals = goals
            stats.assists = assists
            stats.save()
            self.stdout.write(
                f"Row {row_num}: updated stats for {pcs.person} at {pcs.club} in {pcs.season}."
            )
