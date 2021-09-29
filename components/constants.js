export const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((month) => ({ value: month, label: month }));
  
  export const DAYS = [...Array(31).keys()]
    .map((i) => i + 1)
    .map((day) => ({ value: day, label: day }));
  
  export const YEARS = [...Array(100).keys()]
    .reverse()
    .map((i) => i + 1921)
    .map((year) => ({ value: year, label: year }));
  
  export const SIMPLE_REGEX_PATTERN = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;