"use server"
import { EventType } from '@/models/Event';
import { getEventData } from '@/utils/database';
import { DateTime as Luxdt } from 'luxon';
import React from 'react'
import { use} from "react"

const Timebutton = async (dt: Luxdt) => {
    return <li>{dt.toISOTime()}</li>
}


const TimeSlotTable =  ({ eventId }: { eventId: string  }) => {
    let eventItem: EventType = use(getEventData(eventId))



    // const timeslots: Luxdt[] = eventItem.timeSlots



  return (
    <div>
       <ul>
        {/* {await Promise.all(timeslots.map(Timebutton))} */}
        <li>{eventItem.toString()}</li>
        </ul> 

    </div>

  )
}

export default TimeSlotTable