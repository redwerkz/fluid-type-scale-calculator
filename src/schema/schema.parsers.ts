import { UserSuppliedQueryParams } from './schema.types';

export const parseRawValue = (query: UserSuppliedQueryParams, id: string): string | undefined =>
  query[id];

/** Parses the query parameter with the given ID as a number. Returns the default value if the param is not specified. */
export const parseNumber = (options: {
  /** The query params to parse. */
  query: UserSuppliedQueryParams;
  /** The ID to look up in the query string. */
  id: string;
  /** A fallback value to return if the query param with the given ID is not found in the query string. */
  fallback: number;
}): number => {
  const value = parseRawValue(options.query, options.id) ?? options.fallback;
  if (typeof value === 'string' && !value) return NaN;
  return Number(value);
};

/** Parses the query parameter with the given ID as a boolean value corresponding to a checkbox's checked state. */
export const parseCheckboxBoolean = (options: {
  /** The query params to parse. */
  query: UserSuppliedQueryParams;
  /** The ID to look up in the query string. */
  id: string;
}): boolean => {
  const value = parseRawValue(options.query, options.id);

  // HTML forms don't bother serializing checkboxes if they aren't checked. So fall back to false if the query param does not exist in the URL.
  if (typeof value === 'undefined') {
    return false;
  }

  // If the query param exists but is an empty string (e.g., `?booleanWithNoValue`), return true
  if (!value) {
    return true;
  }

  // Interpret the string as a boolean. Note that by default, HTML forms serialize checkboxes to `'on'` if they're checked. But our API also internally accepts `'true'` as a valid alias for `'on'` since it's a bit more intuitive.
  return value === 'on' || value === 'true';
};
