import { useEffect, useState } from "react";
import { api } from "../../api/client";
import {
  BOOKING_STATUSES,
  formatDate,
  formatTime,
  getStatusBadgeClass,
} from "./bookingHelpers";

async function requestFilteredBookings({ status, studentId, resourceId }) {
  return api.get("/bookings", {
    params: {
      status: status === "ALL" ? undefined : status,
      studentId: studentId || undefined,
      resourceId: resourceId || undefined,
    },
  });
}

export default function BookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [studentFilter, setStudentFilter] = useState("");
  const [resourceFilter, setResourceFilter] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBookings = async (nextFilters = {}) => {
    const status = nextFilters.status ?? filter;
    const nextStudentFilter = nextFilters.studentFilter ?? studentFilter;
    const nextResourceFilter = nextFilters.resourceFilter ?? resourceFilter;

    try {
      const response = await requestFilteredBookings({
        status,
        studentId: nextStudentFilter,
        resourceId: nextResourceFilter,
      });
      setBookings(response.data);
      setError("");
    } catch (err) {
      setBookings([]);
      setError(err.response?.data?.message ?? "Unable to load booking requests.");
    }
  };

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await requestFilteredBookings({
          status: filter,
          studentId: studentFilter,
          resourceId: resourceFilter,
        });
        setBookings(response.data);
      } catch (err) {
        setBookings([]);
        setError(err.response?.data?.message ?? "Unable to load booking requests.");
      }
    };

    loadBookings();
  }, [filter, studentFilter, resourceFilter]);

  useEffect(() => {
    api.get("/resources")
      .then((response) => setResources(response.data))
      .catch(() => setResources([]));
  }, []);

  const approveBooking = async (id) => {
    try {
      const response = await api.put(`/bookings/${id}/approve`);
      setBookings((currentBookings) => currentBookings.map((booking) =>
        booking.id === id ? response.data : booking
      ));
      setMessage("Booking approved.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message ?? "Error approving booking.");
    }
  };

  const rejectBooking = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      const response = await api.put(`/bookings/${id}/reject`, { reason });
      setBookings((currentBookings) => currentBookings.map((booking) =>
        booking.id === id ? response.data : booking
      ));
      setMessage("Booking rejected.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message ?? "Error rejecting booking.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-white">Admin Booking Review</h1>
        <p className="mt-2 text-sm text-slate-300">
          Review booking requests, filter the queue, and move requests through the
          required approval workflow.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md md:grid-cols-4">
        <label className="text-sm font-medium text-gray-200">
          Status
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">All statuses</option>
            {BOOKING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-gray-200">
          Student ID
          <input
            type="text"
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            placeholder="Filter by student"
            className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <label className="text-sm font-medium text-gray-200">
          Resource
          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All resources</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={fetchBookings}
          className="self-end rounded-md bg-cyan-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-cyan-700"
        >
          Refresh
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
          No bookings found for the selected filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/50">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Attendees</th>
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
                  <td className="px-4 py-3">{booking.studentId}</td>
                  <td className="px-4 py-3 font-medium text-white">{booking.resourceName}</td>
                  <td className="px-4 py-3">{booking.purpose}</td>
                  <td className="px-4 py-3">{booking.expectedAttendees ?? "-"}</td>
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
                          onClick={() => approveBooking(booking.id)}
                          className="rounded bg-emerald-600 px-3 py-1 text-white transition-colors hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectBooking(booking.id)}
                          className="rounded bg-rose-600 px-3 py-1 text-white transition-colors hover:bg-rose-700"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500">Finalized</span>
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
