import { S3_BUCKET_URL } from "@/lib/constants";

/** Capitalizes the first letter of a string. */
export function capitalize(string: string) {
  if (!string.trim()) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/** Converts a string to a slug. */
export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

/** Gets the full URL of a profile image based on the input. */
export function getFullProfileUrl(input: string): string {
  const s3ProfilePathRegex = /^pic\/(profile\/|)[a-f0-9-]{36}$/;
  const googleUrlRegex = /^https:\/\/lh3\.googleusercontent\.com\/.+$/;
  const linkedinUrlRegex = /^https:\/\/media\.licdn\.com\/dms\/image\/.+$/;

  if (s3ProfilePathRegex.test(input)) {
    return `${S3_BUCKET_URL}/${input}`;
  } else if (googleUrlRegex.test(input) || linkedinUrlRegex.test(input)) {
    return input;
  } else {
    throw new Error("Invalid URL format");
  }
}

/** Get MUX thumbnail URL */
export function getMuxThumbnailUrl(
  videoId: string,
  width: number,
  height: number,
) {
  return `https://image.mux.com/${videoId}/thumbnail.png?width=${width}&height=${height}&time=11`;
}

export const formatExpiryDate = (input: string) => {
  const cleanInput = input.replace(/\D/g, "");
  const month = cleanInput.slice(0, 2);
  const year = cleanInput.slice(2, 4);

  const formattedMonth =
    month.length === 2 && Number(month) > 12 ? "12" : month;

  return formattedMonth + (year ? `/${year}` : "");
};
export const formatNumber = (input: string | number): string => {
  const num = typeof input === "string" ? parseFloat(input) : input;

  if (isNaN(num)) return "Invalid number";

  if (Math.abs(num) >= 1.0e9) return (num / 1.0e9).toFixed(1) + "B";
  if (Math.abs(num) >= 1.0e6) return (num / 1.0e6).toFixed(1) + "M";
  if (Math.abs(num) >= 1.0e3) return (num / 1.0e3).toFixed(1) + "K";

  return num.toString();
};
