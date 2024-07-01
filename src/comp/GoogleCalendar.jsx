import React from "react";

function GoogleCalendar({ email }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Google Calendar</h1>
      <iframe
        src={`https://calendar.google.com/calendar/u/0/embed?src=${email}&pli=1`}
        style={{ border: 0 }}
        width="100%"
        height="600"
        title="Google Calendar"
      ></iframe>
    </div>
  );
}

export default GoogleCalendar;
