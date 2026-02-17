/**
 * Date formatting utilities for consistent date display across the application
 * Handles both git dates and frontmatter dates with graceful error handling
 */

/**
 * Default date format options for consistent display
 */
const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

/**
 * Format a date string to a consistent, readable format
 * Handles both git dates (ISO strings) and frontmatter dates (various formats)
 *
 * @param dateInput - Date string from git or frontmatter
 * @param options - Optional Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date string or fallback for invalid dates
 */
export function formatDate(
  dateInput: string | undefined | null,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
): string {
  // Handle null, undefined, or empty strings
  if (!dateInput || typeof dateInput !== "string" || dateInput.trim() === "") {
    return "Unknown Date";
  }

  const date = new Date(dateInput);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date format: ${dateInput}`);
    return dateInput; // Return original string if we can't parse it
  }

  // Use UTC formatting for date-only strings (e.g., '2024-01-15') to avoid
  // timezone offset shifting the displayed date by a day
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim());
  if (isDateOnly) {
    return date.toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
  }

  return date.toLocaleDateString("en-US", options);
}

/**
 * Get the most appropriate date from git info or frontmatter with consistent formatting
 * Prioritizes git creation date, falls back to frontmatter date
 *
 * @param gitCreatedDate - Date from git history (creation date)
 * @param frontmatterDate - Date from YAML frontmatter
 * @returns Formatted date string using the best available source
 */
export function getFormattedDisplayDate(
  gitCreatedDate: string | undefined | null,
  frontmatterDate: string | undefined | null,
): string {
  // Prefer git creation date if available
  if (gitCreatedDate) {
    return formatDate(gitCreatedDate);
  }

  // Fall back to frontmatter date
  if (frontmatterDate) {
    return formatDate(frontmatterDate);
  }

  // Final fallback
  return "Unknown Date";
}

/**
 * Format date for sorting purposes (returns timestamp)
 * Used internally for date-based sorting operations
 *
 * @param dateInput - Date string from any source
 * @returns Timestamp number for sorting, or 0 for invalid dates
 *
 */
function getDateTimestamp(dateInput: string | undefined | null): number {
  if (!dateInput || typeof dateInput !== "string" || dateInput.trim() === "") {
    return 0;
  }
  const date = new Date(dateInput);
  return date.getTime();
}

/**
 * Compare two dates for sorting (newest first)
 * Handles both git and frontmatter dates with proper fallbacks
 *
 * @param dateA - First date string
 * @param dateB - Second date string
 * @returns Comparison result for Array.sort() (negative = A is newer)
 */
export function compareDatesNewestFirst(
  dateA: string | undefined | null,
  dateB: string | undefined | null,
): number {
  const timestampA = getDateTimestamp(dateA);
  const timestampB = getDateTimestamp(dateB);

  // Newest first (descending order)
  return timestampB - timestampA;
}
