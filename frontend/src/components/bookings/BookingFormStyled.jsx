import { useCallback, useEffect, useState } from "react";
import { api } from "../../api/client";
import {
  buildDateTime,
  loadStudentId,
  saveStudentId,
} from "./bookingHelpers";

const FALLBACK_RESOURCES = [
  {
    name: "Conference Hall 1",
    type: "LECTURE_HALL",
    capacity: 120,
    location: "Main Building - Floor 1",
    availabilityStart: "08:00",
    availabilityEnd: "17:00",
    status: "ACTIVE",
  },
  {
    name: "Business Seminar Hall",
    type: "LECTURE_HALL",
    capacity: 80,
    location: "Business Faculty - Floor 2",
    availabilityStart: "09:00",
    availabilityEnd: "18:00",
    status: "ACTIVE",
  },
  {
    name: "Innovation Hub Room",
    type: "MEETING_ROOM",
    capacity: 20,
    location: "Innovation Center",
    availabilityStart: "08:00",
    availabilityEnd: "20:00",
    status: "ACTIVE",
  },
  {
    name: "Computer Lab A",
    type: "LABORATORY",
    capacity: 40,
    location: "Computing Building - Lab Wing",
    availabilityStart: "08:00",
    availabilityEnd: "17:00",
    status: "ACTIVE",
  },
  {
    name: "Projector Kit",
    type: "EQUIPMENT",
    capacity: 1,
    location: "Equipment Store Room",
    availabilityStart: "08:30",
    availabilityEnd: "16:30",
    status: "ACTIVE",
  },
  {
    name: "Portable Speaker Set",
    type: "EQUIPMENT",
    capacity: 1,
    location: "Equipment Store Room",
    availabilityStart: "08:30",
    availabilityEnd: "16:30",
    status: "ACTIVE",
  },
];

function getFallbackResources() {
  return FALLBACK_RESOURCES.map((resource, index) => ({
    ...resource,
    id: `fallback-resource-${index + 1}`,
  }));
}

function isFallbackResourceId(resourceId) {
  return typeof resourceId === "string" && resourceId.startsWith("fallback-resource-");
}

function normalizeResourceStatus(status) {
  const normalizedStatus = (status ?? "").trim().toUpperCase();

  if (!normalizedStatus || normalizedStatus === "ACTIVE" || normalizedStatus === "AVAILABLE") {
    return "ACTIVE";
  }

  return normalizedStatus;
}

function normalizeResourceType(type) {
  return (type ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function isTypeMatch(resourceType, selectedType) {
  if (!selectedType) {
    return true;
  }

  const normalizedResourceType = normalizeResourceType(resourceType).replaceAll("_", "");
  const normalizedSelectedType = normalizeResourceType(selectedType).replaceAll("_", "");
  return normalizedResourceType === normalizedSelectedType;
}

function getResourceTypeLabel(type) {
  const normalized = normalizeResourceType(type);
  if (!normalized) {
    return "Uncategorized";
  }

  return normalized
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export default function BookingFormStyled() {
  const [resources, setResources] = useState([]);
  const [resourceError, setResourceError] = useState("");
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    studentId: loadStudentId(),
    resourceType: "",
    resourceId: "",
    bookingDate: "",
    startClock: "",
    endClock: "",
    purpose: "",
    expectedAttendees: "",
  });

  const normalizeResources = (resourceList) =>
    (Array.isArray(resourceList) ? resourceList : []).map((resource) => ({
      ...resource,
      id: resource.id ?? resource._id ?? resource.resourceId ?? "",
      status: normalizeResourceStatus(resource.status),
      type: normalizeResourceType(resource.type),
      originalType: resource.type ?? "",
    }));

  const seedDefaultResources = async () => {
    await Promise.allSettled(
      FALLBACK_RESOURCES.map((resource) => api.post("/resources", resource))
    );
  };

  const loadResources = useCallback(async (allowSeed = true) => {
    setIsLoadingResources(true);
    setResourceError("");

    try {
      const response = await api.get("/resources");
      let normalizedResources = normalizeResources(response.data);

      if (normalizedResources.length === 0 && allowSeed) {
        await seedDefaultResources();
        const seededResponse = await api.get("/resources");
        normalizedResources = normalizeResources(seededResponse.data);
      }

      if (normalizedResources.length === 0) {
        setResources(normalizeResources(getFallbackResources()));
        setResourceError("");
      } else {
        setResources(normalizedResources);
        setResourceError("");
      }
    } catch (loadError) {
      console.error(loadError);
      setResources(normalizeResources(getFallbackResources()));
      setResourceError("");
    } finally {
      setIsLoadingResources(false);
    }
  }, []);

  useEffect(() => {
    loadResources(true);
  }, [loadResources]);

  const resourceTypes = [...new Set([
    "LECTURE_HALL",
    "MEETING_ROOM",
    "LABORATORY",
    "EQUIPMENT",
    ...resources.map((resource) => resource.type).filter(Boolean),
  ])].sort();

  const visibleResources = !form.resourceType
    ? resources
    : resources.filter((resource) => isTypeMatch(resource.type, form.resourceType));
  const selectedResource = visibleResources.find((resource) => resource.id === form.resourceId) ?? null;

  const today = new Date();
  const minBookingDate = today.toISOString().split("T")[0];
  const currentTime = today.toTimeString().slice(0, 5);
  const minStartTime = form.bookingDate === minBookingDate ? currentTime : undefined;
  const minEndTime = form.startClock || (form.bookingDate === minBookingDate ? currentTime : undefined);

  const adjustExpectedAttendees = (delta) => {
    const currentValue = Number(form.expectedAttendees || 0);
    const nextValue = Math.max(1, currentValue + delta);
    const cappedValue = selectedResource?.capacity
      ? Math.min(nextValue, selectedResource.capacity)
      : nextValue;

    setForm({
      ...form,
      expectedAttendees: String(cappedValue),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const trimmedStudentId = form.studentId.trim();
      const trimmedPurpose = form.purpose.trim();
      const startTime = buildDateTime(form.bookingDate, form.startClock);
      const endTime = buildDateTime(form.bookingDate, form.endClock);

      if (!trimmedStudentId) {
        setError("Student ID cannot be blank.");
        return;
      }

      if (!form.resourceId) {
        setError(resourceError || "Please select a resource.");
        return;
      }

      if (selectedResource?.status === "INACTIVE") {
        setError("Inactive resources cannot be booked.");
        return;
      }

      if (!form.bookingDate || !form.startClock || !form.endClock) {
        setError("Booking date, start time, and end time are required.");
        return;
      }

      if (!trimmedPurpose) {
        setError("Purpose cannot be blank.");
        return;
      }

      if (form.bookingDate < minBookingDate) {
        setError("You cannot create a booking for a past date.");
        return;
      }

      if (form.bookingDate === minBookingDate && form.startClock < currentTime) {
        setError("You cannot create a booking for a time that has already passed today.");
        return;
      }

      if (form.endClock <= form.startClock) {
        setError("End time must be later than the start time.");
        return;
      }

      let resolvedResourceId = form.resourceId;
      if (isFallbackResourceId(form.resourceId)) {
        const existingResourcesResponse = await api.get("/resources");
        const existingResources = normalizeResources(existingResourcesResponse.data);

        const matchedResource = existingResources.find((resource) =>
          resource.name === selectedResource?.name
          && normalizeResourceType(resource.type) === normalizeResourceType(selectedResource?.type)
        );

        if (matchedResource?.id) {
          resolvedResourceId = matchedResource.id;
        } else if (selectedResource) {
          const createdResourceResponse = await api.post("/resources", {
            name: selectedResource.name,
            type: selectedResource.type,
            capacity: selectedResource.capacity,
            location: selectedResource.location,
            availabilityStart: selectedResource.availabilityStart,
            availabilityEnd: selectedResource.availabilityEnd,
            status: selectedResource.status,
          });

          const createdResource = normalizeResources([createdResourceResponse.data])[0];
          if (!createdResource?.id) {
            throw new Error("Resource could not be prepared for booking.");
          }

          resolvedResourceId = createdResource.id;
        }
      }

      if (!resolvedResourceId || isFallbackResourceId(resolvedResourceId)) {
        setError("Selected resource is not ready in backend. Please reload resources and try again.");
        return;
      }

      const payload = {
        studentId: trimmedStudentId,
        resourceId: resolvedResourceId,
        startTime,
        endTime,
        purpose: trimmedPurpose,
        expectedAttendees: form.expectedAttendees ? Number(form.expectedAttendees) : null,
      };

      const response = await api.post("/bookings", payload);
      saveStudentId(trimmedStudentId);
      setMessage(`Booking request created with status ${response.data.status}.`);
      setForm((current) => ({
        ...current,
        studentId: trimmedStudentId,
        resourceType: "",
        resourceId: "",
        bookingDate: "",
        startClock: "",
        endClock: "",
        purpose: "",
        expectedAttendees: "",
      }));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? "Unable to submit booking request.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-white">Request a Booking</h1>
        <p className="mt-2 text-sm text-slate-300">
          Submit a booking request for a campus resource. New requests start in
          the <span className="font-semibold text-amber-300">PENDING</span> state
          until an admin approves or rejects them.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-white/10 bg-white/10 p-8 shadow-lg backdrop-blur-md"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block text-sm font-medium text-gray-200">
            Student ID
            <input
              type="text"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              placeholder="IT22123456"
              className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
            />
          </label>

          <label className="block text-sm font-medium text-gray-200">
            Resource Type
            <select
              value={form.resourceType}
              onChange={(e) => setForm({
                ...form,
                resourceType: e.target.value,
                resourceId: "",
              })}
              disabled={isLoadingResources}
              className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
            >
              <option value="">
                {isLoadingResources
                  ? "Loading resource types..."
                  : resourceTypes.length === 0
                    ? "No resource types available yet"
                    : "Select resource type"}
              </option>
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {getResourceTypeLabel(type)}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-200">
            Resource
            <select
              value={form.resourceId}
              onChange={(e) => setForm({ ...form, resourceId: e.target.value })}
              disabled={resources.length === 0 || isLoadingResources}
              className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
            >
              <option value="">
                {isLoadingResources
                  ? "Loading resources..."
                  : !form.resourceType
                  ? (resources.length === 0 ? "No resources found" : "Select resource")
                  : "Select resource"}
              </option>
              {visibleResources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} {resource.location ? `- ${resource.location}` : ""} {resource.id ? `(ID: ${resource.id})` : ""} {resource.type ? `- ${getResourceTypeLabel(resource.type)}` : ""} {resource.status === "INACTIVE" ? "[INACTIVE]" : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-200">
            Booking Date
            <input
              type="date"
              value={form.bookingDate}
              onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
              min={minBookingDate}
              className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
          <p className="text-sm font-semibold text-slate-200">Resource Availability</p>
          {selectedResource ? (
            <div className="mt-3 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <div>
                <span className="font-medium text-white">Location:</span> {selectedResource.location || "-"}
              </div>
              <div>
                <span className="font-medium text-white">Status:</span> {selectedResource.status || "ACTIVE"}
              </div>
              <div>
                <span className="font-medium text-white">Capacity:</span> {selectedResource.capacity ?? "-"}
              </div>
              <div>
                <span className="font-medium text-white">Availability:</span>{" "}
                {selectedResource.availabilityStart && selectedResource.availabilityEnd
                  ? `${selectedResource.availabilityStart} - ${selectedResource.availabilityEnd}`
                  : "Not specified"}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-400">
              {resourceTypes.length === 0
                ? "No resources are currently available. Add resources in the resource module first."
                : "Choose a resource type and resource to see its location, capacity, and availability."}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <label className="block text-sm font-medium text-gray-200">
            Start Time
            <input
              type="time"
              value={form.startClock}
              onChange={(e) => setForm({ ...form, startClock: e.target.value })}
              min={minStartTime}
              className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
            />
          </label>

          <label className="block text-sm font-medium text-gray-200">
            End Time
            <input
              type="time"
              value={form.endClock}
              onChange={(e) => setForm({ ...form, endClock: e.target.value })}
              min={minEndTime}
              className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
            />
          </label>

          <label className="block text-sm font-medium text-gray-200">
            Expected Attendees
            <div className="mt-2 flex overflow-hidden rounded-md border border-gray-600 bg-gray-900 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500">
              <button
                type="button"
                onClick={() => adjustExpectedAttendees(-1)}
                className="border-r border-gray-700 px-4 text-xl font-semibold text-slate-200 transition-colors hover:bg-white/5"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                step="1"
                max={selectedResource?.capacity ?? undefined}
                value={form.expectedAttendees}
                placeholder="attendees count"
                onChange={(e) => setForm({ ...form, expectedAttendees: e.target.value })}
                className="booking-number-input w-full bg-gray-900 px-3 py-2 text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => adjustExpectedAttendees(1)}
                className="border-l border-gray-700 px-4 text-xl font-semibold text-slate-200 transition-colors hover:bg-white/5"
              >
                +
              </button>
            </div>
            <span className="mt-2 block text-xs text-slate-400">
              {selectedResource?.capacity
                ? `Maximum attendees for this resource: ${selectedResource.capacity}`
                : "Select a resource to view its capacity."}
            </span>
          </label>
        </div>

        <label className="block text-sm font-medium text-gray-200">
          Purpose
          <textarea
            value={form.purpose}
            placeholder="Project meeting, practice session, workshop..."
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            rows="4"
            className="mt-2 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
          />
        </label>

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

        <button
          type="submit"
          className="w-full rounded-md bg-purple-600 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-purple-700"
        >
          Submit Booking Request
        </button>
      </form>
    </section>
  );
}