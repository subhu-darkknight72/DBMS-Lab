import Calendar from "react-calendar";
import { useEffect, useRef, useState } from "react";
import "react-calendar/dist/Calendar.css";
import Cookies from "js-cookie";


const BookDrivingSlot = ({bookingDate, setBookingDate, selectedTimeSlot, setSelectedTimeSlot, bookingTimes, setBookingTimes}) => {

  const onDateChange = (e) => {
    console.log(e);
    setSelectedTimeSlot(null);
    setBookingDate(e);
    fetch(process.env.REACT_APP_BACKEND_URL.concat("api/get_slots/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: JSON.stringify({
        date: e.toDateString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.hasOwnProperty("Success")) {
          setBookingTimes(data.Success);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="k-my-8">
      <div className="k-mb-4 k-font-weight-bold">Book appointment slot</div>

      <div className="k-flex k-display-flex k-mb-4">
        <Calendar value={bookingDate} onChange={onDateChange} />
        <div className="k-ml-4 k-display-flex k-flex-col">
          {bookingTimes.map((time) => {
            return (
              <button
                key={time}
                className="k-button k-mb-4"
                onClick={(e) => setSelectedTimeSlot(time)}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      {bookingDate && selectedTimeSlot ? (
        <div>
          Selected slot: {bookingDate.toDateString()} at {selectedTimeSlot}
        </div>
      ) : null}
    </div>
  );
};

export default BookDrivingSlot;
