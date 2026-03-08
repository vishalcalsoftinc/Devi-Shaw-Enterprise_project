const MONTH_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const YEAR_FORMAT = new Intl.DateTimeFormat("en-US", { year: "numeric" });

function formatMonthYear(date) {
  return MONTH_FORMAT.format(date);
}

function formatYear(date) {
  return `Year ${YEAR_FORMAT.format(date)}`;
}

export function getDashboardThisFilterOptions(now = new Date()) {
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevYear = new Date(now.getFullYear() - 1, 0, 1);

  return [
    { value: "custom", label: "custom" },
    { value: "all", label: "all" },
    { value: "today", label: "today" },
    { value: "thisWeek", label: "this week" },
    { value: "thisMonth", label: formatMonthYear(now) },
    { value: "previousMonth", label: formatMonthYear(prevMonth) },
    { value: "thisYear", label: formatYear(now) },
    { value: "previousYear", label: formatYear(prevYear) },
  ];
}
