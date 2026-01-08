// Timezone-based sunrise/sunset estimation
// Approximates sunrise/sunset based on timezone and time of year

interface SunTimes {
  sunrise: Date;
  sunset: Date;
}

/**
 * Estimates sunrise and sunset times based on timezone offset and day of year.
 * Uses average latitude (~40°N for most populated areas) for seasonal variation.
 */
export function getEstimatedSunTimes(date: Date = new Date()): SunTimes {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Calculate seasonal variation in daylight
  // Day length varies from ~9 hours (winter) to ~15 hours (summer) at mid-latitudes
  const seasonalAngle = (2 * Math.PI * (dayOfYear - 81)) / 365; // 81 = spring equinox
  const daylightHours = 12 + 3 * Math.sin(seasonalAngle); // Varies 9-15 hours

  // Calculate sunrise and sunset
  const halfDaylight = daylightHours / 2;
  const solarNoon = 12; // Approximate solar noon

  const sunriseHour = solarNoon - halfDaylight;
  const sunsetHour = solarNoon + halfDaylight;

  const sunrise = new Date(date);
  sunrise.setHours(Math.floor(sunriseHour), Math.round((sunriseHour % 1) * 60), 0, 0);

  const sunset = new Date(date);
  sunset.setHours(Math.floor(sunsetHour), Math.round((sunsetHour % 1) * 60), 0, 0);

  return { sunrise, sunset };
}

/**
 * Determines if it's currently daytime based on estimated sunrise/sunset.
 * Uses browser's local timezone automatically.
 */
export function isDaytime(): boolean {
  const now = new Date();
  const { sunrise, sunset } = getEstimatedSunTimes(now);
  return now >= sunrise && now < sunset;
}
