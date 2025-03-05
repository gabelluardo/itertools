/**
 * Performs addition operation based on the types of the provided arguments.
 *
 * @typeParam T - The type of the arguments and return value
 * @param a - First value to add
 * @param b - Second value to add
 * @returns Result of the addition operation
 *
 * @remarks
 * Supported type combinations:
 * - number + number: arithmetic addition
 * - string + string: string concatenation
 * - bigint + bigint: bigint addition
 * - boolean + boolean: logical OR
 * - array + array: array concatenation
 *
 * @throws {Error} When addition is not supported for the provided types
 */

export function add<T>(a: T, b: T): T {
  if (typeof a === "number" && typeof b === "number") {
    return (a + b) as T;
  }
  if (typeof a === "string" && typeof b === "string") {
    return (a + b) as T;
  }
  if (typeof a === "bigint" && typeof b === "bigint") {
    return (a + b) as T;
  }
  if (typeof a === "boolean" && typeof b === "boolean") {
    return (a || b) as T;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return [...a, ...b] as T;
  }

  throw new TypeError(
    "Addition operation not supported for the provided types",
  );
}
