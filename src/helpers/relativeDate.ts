export function relativeDate(date): string {
  const delta = Math.round((+new Date() - new Date(date)) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (delta < 30) {
    return "just now";
  }
  if (delta < minute) {
    return delta + " seconds ago";
  }
  if (delta < 2 * minute) {
    return "a minute ago";
  }
  if (delta < hour) {
    return Math.floor(delta / minute) + " minutes ago";
  }
  if (Math.floor(delta / hour) == 1) {
    return "1 hour ago";
  }
  if (delta < day) {
    return Math.floor(delta / hour) + " hours ago";
  }
  if (delta < day * 2) {
    return "yesterday";
  }
  return delta + " days ago";
}
