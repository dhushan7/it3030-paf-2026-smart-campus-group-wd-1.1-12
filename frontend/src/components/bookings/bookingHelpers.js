export const BOOKING_STATUSES = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];

export const STUDENT_ID_STORAGE_KEY = "smart-campus-student-id";

const STATUS_STYLES = {
  PENDING: "border-amber-400/25 bg-amber-400/12 text-amber-200",
  APPROVED: "border-emerald-400/25 bg-emerald-400/12 text-emerald-200",
  REJECTED: "border-rose-400/25 bg-rose-400/12 text-rose-200",
  CANCELLED: "border-fuchsia-400/25 bg-fuchsia-400/12 text-fuchsia-200",
};

export function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

export function formatTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildDateTime(date, time) {
  if (!date || !time) {
    return "";
  }

  return `${date}T${time}`;
}

export function getStatusBadgeClass(status) {
  return STATUS_STYLES[status] ?? "border-slate-400/25 bg-slate-400/12 text-slate-200";
}

export function loadStudentId() {
  return window.localStorage.getItem(STUDENT_ID_STORAGE_KEY) ?? "";
}

export function saveStudentId(studentId) {
  if (!studentId) {
    window.localStorage.removeItem(STUDENT_ID_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STUDENT_ID_STORAGE_KEY, studentId);
}
