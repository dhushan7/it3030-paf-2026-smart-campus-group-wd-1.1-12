import { useEffect, useState } from "react";
import { api } from "../../api/client";
import {
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
                    {booking.status === "APPROVED" ? (
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
    </section>
  );
}
