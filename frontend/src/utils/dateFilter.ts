export function matchesDate(item: any, date?: string) {
  if (!date) return true;

  const rawDate =
    item.date ??
    item.created_at ??
    item.updated_at ??
    item.scheduled_at ??
    item.expires_at ??
    item.end_date;

  if (!rawDate) return true;

  return String(rawDate).startsWith(date);
}