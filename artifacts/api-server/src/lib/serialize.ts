/** Converts DB rows to JSON-safe values (Date -> ISO string) before Zod response parsing. */
export function jsonify<T>(value: T): unknown {
  return JSON.parse(JSON.stringify(value));
}
