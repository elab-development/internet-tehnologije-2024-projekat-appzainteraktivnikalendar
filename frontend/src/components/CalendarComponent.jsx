import React, { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import "../styles/Calendar.css";

const CalendarComponent = ({
  events = [],
  onDateClick,
  onAppointmentClick,
  onHolidayClick,
}) => {
  const calendarRef = useRef(null);

  const handleEventClick = (info) => {
    // info.event.extendedProps may exist for appointments; holidays in our app do NOT have .doctor
    const ext = info.event.extendedProps || {};

    // If extendedProps has a doctor object -> it's an appointment
    if (ext.doctor) {
      onAppointmentClick && onAppointmentClick(ext, info.event);
      return;
    }

    // Otherwise, treat as holiday (or generic all-day event)
    // We pass some small holiday object (title, start)
    const holidayData = {
      title: info.event.title,
      date: info.event.startStr,
      allDay: info.event.allDay,
    };
    onHolidayClick && onHolidayClick(holidayData, info.event);
  };

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,listWeek",
        }}
        events={events}
        eventClick={handleEventClick}
        dateClick={onDateClick}
        selectable
        height="90vh"
        eventDisplay="block"
      />
    </div>
  );
};

export default CalendarComponent;
