/**
 * Formats a duration given in seconds into a string with the format "XXh YYm".
 * If the hours and minutes are zero, it only shows "XXs".
 * If the hours part is zero, it only shows "YYm".
 * If the minutes part is zero, it only shows "XXh".
 *
 * @param durationInSeconds - The duration in seconds.
 * @returns A formatted string representing the duration in "XXh YYm", "XXh", "YYm", or "XXs".
 */
export const formatDurationFromSeconds = (
  durationInSeconds: number,
): string => {
  // Calculate the whole hours
  const hours = Math.floor(durationInSeconds / 3600);

  // Calculate the remaining minutes
  const minutes = Math.floor((durationInSeconds % 3600) / 60);

  // Calculate the remaining seconds
  const seconds = durationInSeconds % 60;

  if (hours === 0 && minutes === 0) {
    // If both hours and minutes are zero, return only the seconds
    return `${String(seconds).padStart(2, "0")}s`;
  }

  if (hours === 0) {
    // If hours are zero, return only the minutes
    return `${String(minutes).padStart(2, "0")}m`;
  }

  if (minutes === 0) {
    // If minutes are zero, return only the hours
    return `${String(hours).padStart(2, "0")}h`;
  }

  // Format the hours and minutes to always be two digits
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}h ${formattedMinutes}m`;
};

/**
 * Formats a review count string into a compact notation with a maximum of one fractional digit.
 *
 * @param reviewCount - The review count as a string.
 * @returns A formatted string representing the compact notation of the review count.
 */
export const formatReviewCount = (reviewCount: string): string => {
  const count = Number(reviewCount);
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count);
};

/**
 * Converts an ISO date string into a formatted date string.
 *
 * @param isoString - The ISO date string to be converted.
 * @returns A formatted date string in the format "Sep 5, 2023".
 */
export const formatDateWithComma = (isoString: string): string => {
  const date = new Date(isoString);

  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date,
  );
  const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
  const year = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(
    date,
  );

  return `${month} ${day}, ${year}`;
};

/**
 * Converts seconds into a formatted time string in the format "MM:SS".
 * 
 * @param seconds - The number of seconds to be converted.
 * @returns A formatted time string in the format "MM:SS".
 */
export const formatVideoDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}