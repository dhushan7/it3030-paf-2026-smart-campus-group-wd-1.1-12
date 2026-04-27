import { useEffect, useState } from "react";
import { api } from "../../api/client";
import {
  buildDateTime,
  formatDate,
  formatTime,
  getStatusBadgeClass,
  loadStudentId,
  saveStudentId,
} from "./bookingHelpers";

async function requestStudentBookings(studentId) {
  return api.get("/bookings/mine", {
    params: { studentId },
  });
}

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [studentId, setStudentId] = useState(loadStudentId());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editForm, setEditForm] = useState({
    resourceId: "",
    bookingDate: "",
    startClock: "",
    endClock: "",
    purpose: "",
    expectedAttendees: "",
  });

  const toDateInputValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const toTimeInputValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${hour}:${minute}`;
  };

  const fetchBookings = async (selectedStudentId = studentId) => {
    if (!selectedStudentId) {
      setBookings([]);
      setError("Enter your student ID to view your bookings.");
      return;
    }

    try {
      setError("");
      setMessage("");
      const response = await requestStudentBookings(selectedStudentId);
      saveStudentId(selectedStudentId);
      setBookings(response.data);
    } catch (err) {
      setBookings([]);
      setError(err.response?.data?.message ?? "Unable to load your bookings.");
    }
  };

  useEffect(() => {
    const initialStudentId = loadStudentId();
    if (!initialStudentId) {
      return;
    }

    const loadInitialBookings = async () => {
      try {
        const response = await requestStudentBookings(initialStudentId);
        setBookings(response.data);
      } catch (err) {
        setBookings([]);
        setError(err.response?.data?.message ?? "Unable to load your bookings.");
      }
    };

    loadInitialBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      const response = await api.put(`/bookings/${id}/cancel`, null, {
        params: { studentId },
      });
      setBookings((currentBookings) => currentBookings.map((booking) =>
        booking.id === id ? response.data : booking
      ));
      setMessage("Booking cancelled successfully.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message ?? "Error cancelling booking.");
    }
  };

  const startEditing = (booking) => {
    setEditingBookingId(booking.id);
    setEditForm({
      resourceId: booking.resourceId,
      bookingDate: toDateInputValue(booking.startTime),
      startClock: toTimeInputValue(booking.startTime),
      endClock: toTimeInputValue(booking.endTime),
      purpose: booking.purpose ?? "",
      expectedAttendees:
        booking.expectedAttendees === null || booking.expectedAttendees === undefined
          ? ""
          : String(booking.expectedAttendees),
    });
    setMessage("");
    setError("");
  };

  const cancelEditing = () => {
    setEditingBookingId(null);
    setEditForm({
      resourceId: "",
      bookingDate: "",
      startClock: "",
      endClock: "",
      purpose: "",
      expectedAttendees: "",
    });
  };

  const saveBookingUpdate = async (bookingId) => {
    if (!editForm.bookingDate || !editForm.startClock || !editForm.endClock) {
      setError("Booking date, start time, and end time are required.");
      return;
    }

    if (editForm.endClock <= editForm.startClock) {
      setError("End time must be later than start time.");
      return;
    }

    if (!editForm.purpose.trim()) {
      setError("Purpose cannot be blank.");
      return;
    }

    try {
      const payload = {
        studentId,
        resourceId: editForm.resourceId,
        startTime: buildDateTime(editForm.bookingDate, editForm.startClock),
        endTime: buildDateTime(editForm.bookingDate, editForm.endClock),
        purpose: editForm.purpose.trim(),
        expectedAttendees: editForm.expectedAttendees ? Number(editForm.expectedAttendees) : null,
      };

      const response = await api.put(`/bookings/${bookingId}`, payload, {
        params: { studentId },
      });

      setBookings((currentBookings) =>
        currentBookings.map((booking) => (booking.id === bookingId ? response.data : booking))
      );
      setMessage("Pending booking updated successfully.");
      setError("");
      cancelEditing();
    } catch (err) {
      setError(err.response?.data?.message ?? "Error updating booking.");
    }
  };

  const deletePendingBooking = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}`, {
        params: { studentId },
      });
      setBookings((currentBookings) => currentBookings.filter((booking) => booking.id !== bookingId));
      setMessage("Pending booking deleted successfully.");
      setError("");
      if (editingBookingId === bookingId) {
        cancelEditing();
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Error deleting booking.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-white">My Bookings</h1>
        <p className="mt-2 text-sm text-slate-300">
          Check your booking history and cancel approved reservations when plans change.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md md:flex-row md:items-end">
        <label className="flex-1 text-sm font-medium text-gray-200">
          Student ID
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="IT22123456"
            className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <button
          type="button"
          onClick={() => fetchBookings(studentId)}
          className="rounded-md bg-cyan-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-cyan-700"
        >
          Load My Bookings
        </button>
      </div>

      {message ? (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-black/10 p-8 text-center text-slate-300">
          No bookings to show.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/50">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {bookings.map((booking) => (
                <tr key={booking.id} className="align-top">
                  <td className="px-4 py-3 font-medium text-white">{booking.resourceName}</td>
                  <td className="px-4 py-3">{booking.purpose}</td>
                  <td className="px-4 py-3">{formatDate(booking.startTime)}</td>
                  <td className="px-4 py-3">{formatTime(booking.startTime)}</td>
                  <td className="px-4 py-3">{formatTime(booking.endTime)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{booking.reviewReason || "-"}</td>
                  <td className="px-4 py-3">
                    {booking.status === "PENDING" ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(booking)}
                          className="rounded bg-cyan-600 px-3 py-1 text-white transition-colors hover:bg-cyan-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePendingBooking(booking.id)}
                          className="rounded bg-rose-600 px-3 py-1 text-white transition-colors hover:bg-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    ) : booking.status === "APPROVED" ? (
                      <button
                        type="button"
                        onClick={() => cancelBooking(booking.id)}
                        className="rounded bg-rose-600 px-3 py-1 text-white transition-colors hover:bg-rose-700"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-slate-500">No action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingBookingId ? (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
          <h3 className="text-lg font-semibold text-cyan-200">Edit Pending Booking</h3>
          <p className="mt-1 text-xs text-cyan-100/80">
            Updates are allowed only while booking status is pending.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-gray-200">
              Booking Date
              <input
                type="date"
                value={editForm.bookingDate}
                onChange={(e) => setEditForm({ ...editForm, bookingDate: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white"
              />
            </label>

            <label className="text-sm text-gray-200">
              Purpose
              <input
                type="text"
                value={editForm.purpose}
                onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white"
              />
            </label>

            <label className="text-sm text-gray-200">
              Start Time
              <input
                type="time"
                value={editForm.startClock}
                onChange={(e) => setEditForm({ ...editForm, startClock: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white"
              />
            </label>

            <label className="text-sm text-gray-200">
              End Time
              <input
                type="time"
                value={editForm.endClock}
                onChange={(e) => setEditForm({ ...editForm, endClock: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white"
              />
            </label>

            <label className="text-sm text-gray-200 md:col-span-2">
              Expected Attendees (optional)
              <input
                type="number"
                min="1"
                value={editForm.expectedAttendees}
                onChange={(e) => setEditForm({ ...editForm, expectedAttendees: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white"
              />
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => saveBookingUpdate(editingBookingId)}
              className="rounded bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="rounded bg-slate-700 px-4 py-2 text-white transition-colors hover:bg-slate-600"
            >
              Cancel Edit
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
