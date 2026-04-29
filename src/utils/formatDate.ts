import { format, isToday, isYesterday } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "Hari Ini";
  if (isYesterday(date)) return "Kemarin";
  return format(date, "dd MMM yyyy", { locale: id });
}

export function formatDateGroup(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "Hari Ini";
  if (isYesterday(date)) return "Kemarin";
  return format(date, "dd MMMM yyyy", { locale: id });
}
