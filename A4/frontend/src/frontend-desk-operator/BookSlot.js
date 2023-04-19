import BookDrivingSlot from "./TimeSlot";
import { useState } from "react";
import Cookies from "js-cookie";

function bookSlot(bookingDate, setSelectedTimeSlot, id) {
  console.log(bookingDate, setSelectedTimeSlot);
  console.log(id);
  fetch(process.env.REACT_APP_BACKEND_URL.concat("api/book_slot/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    body: JSON.stringify({
      date: bookingDate.toDateString(),
      time: setSelectedTimeSlot,
      patient: id
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log({data});
      alert(data.Success);
    });
}

function BookSlot({id}) {
  const [bookingDate, setBookingDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingTimes, setBookingTimes] = useState([]);
  return (
    <div
      class="modal fade"
      id="slot"
      tabindex="-1"
      aria-labelledby="slotLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg ">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="slotLabel">
              Book Appointment
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <BookDrivingSlot
              bookingDate={bookingDate}
              setBookingDate={setBookingDate}
              selectedTimeSlot={selectedTimeSlot}
              setSelectedTimeSlot={setSelectedTimeSlot}
              bookingTimes={bookingTimes}
              setBookingTimes={setBookingTimes}
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={(e) => {
                bookSlot(bookingDate, selectedTimeSlot, id);
              }}
            >
              Save Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BookSlot;
