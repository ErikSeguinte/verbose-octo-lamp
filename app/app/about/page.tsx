import React from "react";

const Text = () => {
  return (
    <ul>
      <li>
        <h4>Basic stuff it needs to be able to do:</h4>
      </li>
      <ul>
        <li>
          Let me create a “calendar” that goes from Time A to Time B, with days
          broken down into ½ hour slots
        </li>
        <li>
          have a shareable link I can send to people that’s unique to each event
        </li>
        <li>
          accept input from multiple different people on different computers
          that gets labeled with their name
        </li>
        <li>
          allow the user to select the timezone they’re in, with the times/days
          adjusted to that time zone
        </li>
        <li>
          allow those people to indicate which blocks of time they are
          available.
        </li>
        <li>
          Display each individual input on its own on the calendar when selected
        </li>
        <li>
          Allow me to select multiple individuals, and show the time slots where
          their availability overlaps
        </li>
      </ul>
      <li>
        <h4>Stuff I’d really LIKE if it could do</h4>
      </li>
      <ul>
        <li>
          Alphabetize the list of people who have turned in their availability
          (this especially. Please.)
        </li>
        <li>
          Indicate if all but one of the people selected are available for a
          time slot
        </li>
        <li>Be easily useable on mobile</li>
      </ul>
      <li>
        <h4>Stuff I’d also like if it could do, but way lower priority</h4>
      </li>
      <ul>
        <li>
          Allow me to edit the event calendar after the fact, extending the time
          it covers
        </li>
        <li>Allow users to edit their availability</li>
        <li>export directly to a google calendar</li>
      </ul>
      <li>
        <h4>Visual/interface stuff I’d like</h4>
      </li>
      <ul>
        <li>day of the week indicated</li>
        <li>
          day/date at top, times in a vertical column downward (I like the
          whenisgood layout for that)
        </li>
        <li>
          Ideally, display the time zone the calendar is currently using in
          really big font at the top somewhere.
        </li>
        <li>Obvious and easy to find place to change the time zone.</li>
      </ul>
    </ul>
  );
};

const About = () => {
  return (
    <div className="flex justify-center items-center w-screen">
      <div className="prose">
        <h1>Goals</h1>
        <Text />
      </div>
    </div>
  );
};

export default About;
