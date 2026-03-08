// useFilteredOrders.js
import { useQuery } from "@tanstack/react-query";
import {
  subDays,
  subMonths,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfMonth,
  differenceInDays,
} from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getOrdersBetweenDates } from "../../services/apiOrders";

const ALL_START_DATE = new Date(2024, 0, 1);

function getDateRangeByThisFilter(filterByThis) {
  const now = new Date();
  const previousYear = now.getFullYear() - 1;

  const rangeMap = {
    today: {
      startDate: startOfDay(now),
      endDate: now,
    },
    thisWeek: {
      startDate: startOfWeek(now),
      endDate: now,
    },
    thisMonth: {
      startDate: startOfMonth(now),
      endDate: now,
    },
    previousMonth: (() => {
      const prevMonthDate = subMonths(now, 1);
      return {
        startDate: startOfMonth(prevMonthDate),
        endDate: endOfMonth(prevMonthDate),
      };
    })(),
    thisYear: {
      startDate: startOfYear(now),
      endDate: now,
    },
    previousYear: {
      startDate: new Date(previousYear, 0, 1),
      endDate: new Date(previousYear, 11, 31, 23, 59, 59, 999),
    },
    all: {
      startDate: ALL_START_DATE,
      endDate: now,
    },
  };

  return (
    rangeMap[filterByThis] || {
      startDate: subDays(now, 1),
      endDate: now,
    }
  );
}

export function useFilteredOrders() {
  const [searchParams] = useSearchParams();
  const filterByThis = searchParams.get("filterByThis");
  const customStartDate = searchParams.get("startDate");
  const customEndDate = searchParams.get("endDate");

  let startDate, endDate, queryKey, queryFn;

  if (customStartDate && customEndDate) {
    startDate = startOfDay(new Date(customStartDate));
    endDate = new Date(customEndDate);
    endDate.setHours(23, 59, 59, 999);
    queryKey = ["orders", "customRange", customStartDate, customEndDate];
    queryFn = () =>
      getOrdersBetweenDates(startDate.toISOString(), endDate.toISOString());
  } else if (filterByThis && filterByThis !== "custom") {
    ({ startDate, endDate } = getDateRangeByThisFilter(filterByThis));
    queryKey = ["orders", "filterByThis", filterByThis];
    queryFn = () =>
      getOrdersBetweenDates(startDate.toISOString(), endDate.toISOString());
  } else if (filterByThis === "custom") {
    startDate = startOfDay(new Date());
    endDate = new Date();
    queryKey = ["orders", "filterByThis", "custom"];
    queryFn = () =>
      getOrdersBetweenDates(startDate.toISOString(), endDate.toISOString());
  } else {
    // Default: use today
    startDate = startOfDay(new Date());
    endDate = new Date();
    queryKey = ["orders", "filterByThis", "today"];
    queryFn = () =>
      getOrdersBetweenDates(startDate.toISOString(), endDate.toISOString());
  }

  const { isLoading, data: orders } = useQuery({
    queryKey,
    queryFn,
  });

  const numDays = differenceInDays(endDate, startDate) + 1;

  //   console.log(filterByThis, filterByMonth, startDate, endDate);

  return { isLoading, orders, startDate, endDate, numDays };
}
