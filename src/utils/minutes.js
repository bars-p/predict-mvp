export function timeToMinutes(timeString) {
  console.log('Time Input', timeString); // FIXME:
  const time = timeString.split(':');
  const minutes = +time[0] * 60 + +time[1];
  console.log('Minutes:', minutes); // FIXME:
  return minutes;
}

export function minutesToTime(minutes) {
  const minutesPart = minutes % 60;
  const hoursPart = (minutes - minutesPart) / 60;
  const timeString =
    ('0' + hoursPart.toString()).slice(-2) +
    ':' +
    ('0' + minutesPart.toString()).slice(-2);
  console.log('Time String:', timeString); // FIXME:
  return timeString;
}
