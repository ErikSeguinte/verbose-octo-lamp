import json
from pathlib import Path
import random

user_file = "app/utils/dummydata/users.json"
new_user_file = "app/utils/dummydata/users22.json"
events_file = "app/utils/dummydata/events.json"
new_events_file = "app/utils/dummydata/events2.json"

users = json.loads(Path(user_file).read_text())

events = json.loads(Path(events_file).read_text())


user_ids = [u["id"] for u in users]


for event in events:
    event["organizer"] = random.choice(user_ids)

    participants = []

    for _ in range(random.randrange(0, 20)):
        user = random.choice(user_ids)
        if user not in participants:
            participants.append(user)

    event["participants"] = participants


Path(new_events_file).write_text(json.dumps(events))