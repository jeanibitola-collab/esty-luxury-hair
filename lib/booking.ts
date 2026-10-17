// Opening hours used to create time slots.
// 0 = Sunday, 1 = Monday ... 6 = Saturday. null = closed.
// Keep these matching the hours in site.ts.
export const openingHours: Record<number, { open: string; close: string } | null> = {
  0: null,
  1: { open: "09:00", close: "19:00" },
  2: { open: "09:00", close: "19:00" },
  3: { open: "09:00", close: "19:00" },
  4: { open: "09:00", close: "19:00" },
  5: { open: "09:00", close: "19:00" },
  6: { open: "08:00", close: "20:00" },
};

export const slotInterval = 30;    // minutes between start times
export const daysAhead = 14;       // how far ahead people can book
export const minNoticeMinutes = 60; // no same-day bookings less than 1 hr away

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// 570 -> "9:30am"
export function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")}${suffix}`;
}

export function getUpcomingDays(from: Date) {
  const days: Date[] = [];
  for (let i = 0; i < daysAhead; i++) {
    days.push(new Date(from.getFullYear(), from.getMonth(), from.getDate() + i));
  }
  return days;
}

export function isOpen(date: Date) {
  return openingHours[date.getDay()] !== null;
}

export function getTimeSlots(date: Date, duration: number, now: Date) {
  const hours = openingHours[date.getDay()];
  if (!hours) return [];

  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const isToday = date.toDateString() === now.toDateString();
  const earliest = isToday
    ? now.getHours() * 60 + now.getMinutes() + minNoticeMinutes
    : 0;

  const slots: number[] = [];
  for (let t = open; t + duration <= close; t += slotInterval) {
    if (t >= earliest) slots.push(t);
  }
  return slots;
}