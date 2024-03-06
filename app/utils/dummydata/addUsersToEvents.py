import json
from pathlib import Path
import random
import ulid

events_file = "events.json"
new_events_file = "events2.json"


events = json.loads(Path(events_file).read_text())

events = events[:10]

for e in events:
    e["inviteCode"] = ulid.ulid()




Path(new_events_file).write_text(json.dumps(events[:len(events)//2]))