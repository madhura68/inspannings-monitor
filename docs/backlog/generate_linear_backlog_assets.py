import csv
from pathlib import Path


BASE_DIR = Path("/Users/janpetervisser/Development/third/docs/backlog")
SOURCE_CSV = BASE_DIR / "inspannings-monitor-backlog.csv"
LINEAR_CSV = BASE_DIR / "inspannings-monitor-linear-import-issues.csv"
PROJECTS_CSV = BASE_DIR / "inspannings-monitor-linear-projects.csv"

TEAM_NAME = "Inspannings Monitor"
INITIATIVE_NAME = "Release 1 MVP"
CREATED_AT = "2026-04-17T00:00:00Z"

LINEAR_HEADERS = [
    "ID",
    "Team",
    "Title",
    "Description",
    "Status",
    "Estimate",
    "Priority",
    "Project ID",
    "Project",
    "Creator",
    "Assignee",
    "Labels",
    "Cycle Number",
    "Cycle Name",
    "Cycle Start",
    "Cycle End",
    "Created",
    "Updated",
    "Started",
    "Triaged",
    "Completed",
    "Canceled",
    "Archived",
    "Due Date",
    "Parent issue",
    "Initiatives",
    "Project Milestone ID",
    "Project Milestone",
    "SLA Status",
]

PRIORITY_MAP = {
    "P0": "high",
    "P1": "medium",
}


def read_rows():
    with SOURCE_CSV.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def build_epic_map(rows):
    return {
        row["ID"]: row["Title"]
        for row in rows
        if row.get("Issue Type") == "Epic"
    }


def normalize_labels(raw):
    labels = [label.strip() for label in raw.split(";") if label.strip()]
    return ", ".join(labels)


def build_description(row, epic_title):
    parts = [
        row["Description"].strip(),
        "",
        "## Context",
        f"- Bron backlog-ID: `{row['ID']}`",
        f"- Epic / project: `{epic_title}`",
        f"- Fase: `{row['Phase']}`",
    ]
    depends_on = row.get("Depends On", "").strip()
    if depends_on:
        parts.append(f"- Afhankelijk van: `{depends_on}`")
    definition = row.get("Definition of Done", "").strip()
    if definition:
        parts.extend(
            [
                "",
                "## Definition of done",
                definition,
            ]
        )
    return "\n".join(parts).strip()


def build_linear_rows(rows):
    epic_map = build_epic_map(rows)
    linear_rows = []

    for row in rows:
        if row.get("Issue Type") != "Story":
            continue

        epic_id = row.get("Epic", "").strip()
        epic_title = epic_map.get(epic_id, "")
        labels = normalize_labels(row.get("Labels", ""))

        linear_rows.append(
            {
                "ID": "",
                "Team": TEAM_NAME,
                "Title": row["Title"].strip(),
                "Description": build_description(row, epic_title),
                "Status": "Backlog",
                "Estimate": "",
                "Priority": PRIORITY_MAP.get(row.get("Priority", "").strip(), ""),
                "Project ID": "",
                "Project": epic_title,
                "Creator": "",
                "Assignee": "",
                "Labels": labels,
                "Cycle Number": "",
                "Cycle Name": "",
                "Cycle Start": "",
                "Cycle End": "",
                "Created": CREATED_AT,
                "Updated": "",
                "Started": "",
                "Triaged": "",
                "Completed": "",
                "Canceled": "",
                "Archived": "",
                "Due Date": "",
                "Parent issue": "",
                "Initiatives": INITIATIVE_NAME,
                "Project Milestone ID": "",
                "Project Milestone": "",
                "SLA Status": "",
            }
        )

    return linear_rows


def write_linear_csv(rows):
    with LINEAR_CSV.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=LINEAR_HEADERS)
        writer.writeheader()
        writer.writerows(rows)


def write_projects_csv():
    headers = [
        "Name",
        "Summary",
        "Status",
        "Milestones",
        "Creator",
        "Lead",
        "Members",
        "Created At",
        "Started At",
        "Target Date",
        "Completed At",
        "Canceled At",
        "Teams",
        "Initiatives",
    ]
    rows = [
        {
            "Name": "Fundament",
            "Summary": "Leg de technische basis voor release 1 met projectsetup, omgevingen, UI-basis en foutafhandeling.",
            "Status": "Planned",
            "Milestones": "",
            "Creator": "",
            "Lead": "",
            "Members": "",
            "Created At": CREATED_AT,
            "Started At": "",
            "Target Date": "",
            "Completed At": "",
            "Canceled At": "",
            "Teams": TEAM_NAME,
            "Initiatives": INITIATIVE_NAME,
        },
        {
            "Name": "Auth en profiel",
            "Summary": "Implementeer accounttoegang, profieldata, onboarding en basisinstellingen per gebruiker.",
            "Status": "Planned",
            "Milestones": "",
            "Creator": "",
            "Lead": "",
            "Members": "",
            "Created At": CREATED_AT,
            "Started At": "",
            "Target Date": "",
            "Completed At": "",
            "Canceled At": "",
            "Teams": TEAM_NAME,
            "Initiatives": INITIATIVE_NAME,
        },
        {
            "Name": "Ochtendcheck-in",
            "Summary": "Bouw de ochtendcheck-in met energiescore, slaapkwaliteit en automatische budgetafleiding.",
            "Status": "Planned",
            "Milestones": "",
            "Creator": "",
            "Lead": "",
            "Members": "",
            "Created At": CREATED_AT,
            "Started At": "",
            "Target Date": "",
            "Completed At": "",
            "Canceled At": "",
            "Teams": TEAM_NAME,
            "Initiatives": INITIATIVE_NAME,
        },
        {
            "Name": "Dagplanning",
            "Summary": "Maak plannen van activiteiten mogelijk met budgetfeedback, energie-impact en prioriteit.",
            "Status": "Planned",
            "Milestones": "",
            "Creator": "",
            "Lead": "",
            "Members": "",
            "Created At": CREATED_AT,
            "Started At": "",
            "Target Date": "",
            "Completed At": "",
            "Canceled At": "",
            "Teams": TEAM_NAME,
            "Initiatives": INITIATIVE_NAME,
        },
        {
            "Name": "Evaluatie en dagoverzicht",
            "Summary": "Maak evaluatie van activiteiten en een dagelijks overzicht van gepland versus uitgevoerd mogelijk.",
            "Status": "Planned",
            "Milestones": "",
            "Creator": "",
            "Lead": "",
            "Members": "",
            "Created At": CREATED_AT,
            "Started At": "",
            "Target Date": "",
            "Completed At": "",
            "Canceled At": "",
            "Teams": TEAM_NAME,
            "Initiatives": INITIATIVE_NAME,
        },
        {
            "Name": "Weekoverzicht en inzichten",
            "Summary": "Voeg weekterugblik, eenvoudige aggregaties en veilige patroonweergave toe zonder medische claims.",
            "Status": "Backlog",
            "Milestones": "",
            "Creator": "",
            "Lead": "",
            "Members": "",
            "Created At": CREATED_AT,
            "Started At": "",
            "Target Date": "",
            "Completed At": "",
            "Canceled At": "",
            "Teams": TEAM_NAME,
            "Initiatives": INITIATIVE_NAME,
        },
        {
            "Name": "Reflectie en reminders",
            "Summary": "Voeg optionele T+1/T+2 reflectieprompts en lichte reminderlogica toe voor zwaardere dagen.",
            "Status": "Backlog",
            "Milestones": "",
            "Creator": "",
            "Lead": "",
            "Members": "",
            "Created At": CREATED_AT,
            "Started At": "",
            "Target Date": "",
            "Completed At": "",
            "Canceled At": "",
            "Teams": TEAM_NAME,
            "Initiatives": INITIATIVE_NAME,
        },
        {
            "Name": "Security en operations",
            "Summary": "Borg logging, rate limiting, secrets, back-up en owner-only toegangscontrole voor echte gebruikersintroductie.",
            "Status": "Planned",
            "Milestones": "",
            "Creator": "",
            "Lead": "",
            "Members": "",
            "Created At": CREATED_AT,
            "Started At": "",
            "Target Date": "",
            "Completed At": "",
            "Canceled At": "",
            "Teams": TEAM_NAME,
            "Initiatives": INITIATIVE_NAME,
        },
        {
            "Name": "Launch-readiness",
            "Summary": "Rond QA, copy review, accessibility checks, DPIA-input en go-live checks voor release 1 af.",
            "Status": "Backlog",
            "Milestones": "",
            "Creator": "",
            "Lead": "",
            "Members": "",
            "Created At": CREATED_AT,
            "Started At": "",
            "Target Date": "",
            "Completed At": "",
            "Canceled At": "",
            "Teams": TEAM_NAME,
            "Initiatives": INITIATIVE_NAME,
        },
    ]

    with PROJECTS_CSV.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)


def main():
    rows = read_rows()
    linear_rows = build_linear_rows(rows)
    write_linear_csv(linear_rows)
    write_projects_csv()
    print(LINEAR_CSV)
    print(f"rows={len(linear_rows)}")
    print(PROJECTS_CSV)
    print("projects=9")


if __name__ == "__main__":
    main()
