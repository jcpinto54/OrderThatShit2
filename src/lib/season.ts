/**
 * Black Friday week: from the Friday before Black Friday through Cyber Monday, the site
 * switches its sale to a Black Friday sale. It turns itself on, so it can ship any time.
 * ?bf=1 forces it on (previews, screenshots, recording clips) and ?bf=0 forces it off.
 */

/** Black Friday: the day after the fourth Thursday of November. */
export function blackFriday(year: number): Date {
  const firstWeekday = new Date(year, 10, 1).getDay();
  const firstThursday = 1 + ((4 - firstWeekday + 7) % 7);
  return new Date(year, 10, firstThursday + 21 + 1);
}

export function isBlackFridayWeek(now = new Date()): boolean {
  if (typeof window !== "undefined") {
    const forced = new URLSearchParams(window.location.search).get("bf");
    if (forced === "1") return true;
    if (forced === "0") return false;
  }
  const bf = blackFriday(now.getFullYear());
  const start = new Date(bf.getFullYear(), bf.getMonth(), bf.getDate() - 7);
  const end = new Date(bf.getFullYear(), bf.getMonth(), bf.getDate() + 4); // midnight after Cyber Monday
  return now >= start && now < end;
}
