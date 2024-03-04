from pathlib import Path
import json
from datetime import datetime, date, timezone, time, timedelta
import random
from bson import ObjectId

events_file = "events.json"
events2_file = "events2.json"

events = json.load(Path(events_file).open())


def create_all_timesslots(start: str, end:str) -> list[datetime]:
    
    dt = datetime.fromisoformat(start)
    timeslots = []

    while dt < (datetime.fromisoformat(end) +  timedelta(days=1)):
        timeslots.append(dt.isoformat())
        dt = dt + timedelta(minutes=30)
    
    return timeslots

octolamps = []

for event in events:
    timeslots = create_all_timesslots(event["startDate"], event["endDate"])
    num_slots = len(timeslots) // 6
    for participant in event["participants"]:
        octolamp = {}
        octolamp["user"] = participant
        octolamp["event"] = event["id"]
        octolamp["id"] = {"$oid": str(ObjectId())}
        octolamp["timeslots"] = random.choices(timeslots,k=num_slots)
        octolamps.append(octolamp)

Path("availabilities.json").write_text(json.dumps(octolamps[:len(octolamps)//2]))
