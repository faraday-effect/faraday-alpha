import dateFns = require("date-fns");

export function currentDate() {
  return dateFns.format(new Date(), "YYYY-MM-DD");
}

export function currentTime() {
  return dateFns.format(new Date(), "HH:mm:ss");
}

export function currentDateAndTime() {
  return dateFns.format(new Date(), "YYYY-MM-DD HH:mm:ss");
}
