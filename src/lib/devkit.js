/**
 * Standard Utility Toolkit powered by @codewithraheem/devkit
 * Use this module across the admin dashboard to avoid duplicate utility helpers and ad-hoc implementations.
 */
export {
  // Array helpers (deduplication, partitioning, grouping)
  unique,
  chunk,
  compact,
  flatten,
  groupBy,
  partition,
  shuffle,
  // Object helpers (deep cloning, picking/omitting, safe property access)
  deepClone,
  getPath,
  isEmpty,
  omit,
  pick,
  // String formatting & transformation
  capitalize,
  isBlank,
  slugify,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  truncate,
  // Math & numeric utilities
  average,
  clamp,
  isFiniteNumber,
  randomInt,
  roundTo,
  sum,
  // Async flow control (debounce, throttle, retry, timeout, sleep)
  debounce,
  retry,
  sleep,
  throttle,
  withTimeout,
  // Validation & safe parsing
  isEmail,
  isPlainObject,
  isURL,
  isUUID,
  isValidJSON,
  safeJsonParse,
  // Error handling & normalization
  getErrorMessage,
  isErrorLike,
  normalizeError,
  // Date utilities
  daysBetween,
  endOfDay,
  isValidDate,
  startOfDay,
} from '@codewithraheem/devkit';
