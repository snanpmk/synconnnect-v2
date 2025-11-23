import moment from "moment";

export const getDateRange = (range, from, to) => {
  const now = moment();
  let start, end;

  switch (range) {
    /** -----------------------
     * LAST 7 DAYS (including today)
     ------------------------ */
    case "last_week":
      end = moment().endOf("day");
      start = moment().subtract(6, "days").startOf("day");
      break;

    /** -----------------------
     * LAST 30 DAYS (including today)
     ------------------------ */
    case "last_month":
      end = moment().endOf("day");
      start = moment().subtract(29, "days").startOf("day");
      break;

    /** -----------------------
     * LAST 6 MONTHS
     ------------------------ */
    case "last_6_months":
      end = moment().endOf("day");
      start = moment().subtract(6, "months").startOf("day");
      break;

    /** -----------------------
     * LAST 12 MONTHS
     ------------------------ */
    case "last_year":
      end = moment().endOf("day");
      start = moment().subtract(1, "year").startOf("day");
      break;

    /** -----------------------
     * CUSTOM DATE RANGE
     ------------------------ */
    case "custom":
      start = moment(from).startOf("day");
      end = moment(to).endOf("day");
      break;

    /** -----------------------
     * DEFAULT (last 30 days)
     ------------------------ */
    default:
      end = moment().endOf("day");
      start = moment().subtract(29, "days").startOf("day");
      break;
  }

  return { start: start.toDate(), end: end.toDate() };
};
