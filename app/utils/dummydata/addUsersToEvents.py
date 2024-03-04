import json
from pathlib import Path
import random

events_file = "events.json"
new_events_file = "events2.json"


events = json.loads(Path(events_file).read_text())




Path(new_events_file).write_text(json.dumps(events[:len(events)//2]))