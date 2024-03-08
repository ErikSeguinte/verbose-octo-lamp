import { DateTime } from "luxon";

import { oid } from "./common";

export class AvailabilityType {
    id: oid
    user: oid
    event: oid
    timeslots: DateTime[]

    constructor({
        id,
        user,
        event,
        timeslots    }:{
            id: oid,
            user: oid,
            event: oid,
            timeslots: DateTime[]
        }){
            this.id = id
            this.user = user
            this.event = event
            this.timeslots = timeslots
        }
}

export type availabilityJson = {
    id: oid
      event: oid,
      user: oid,
      timeslots: string[]
  };