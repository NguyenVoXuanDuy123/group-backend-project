type CamelCaseObject = {
  [key: string]: unknown;
};
type transformKeysToCamelCaseType = {
  [key: string | number | symbol]: unknown;
};

/**
 * This function converts a snake_case string to camelCase. *
 * @param str
 * @returns The camelCase string.
 */

function snakeToCamel(str: string): string {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr: string) =>
    chr.toUpperCase()
  );
}

/**
 * This function converts an object to camelCase.
 * It recursively transforms the object's keys and values to camelCase.
 * It also converts dates to ISO strings and handles special case keys.
 * @param obj - The object to convert to camelCase.
 * @returns A new object with camelCase keys and values.
 */

export const camelCaseifyWithDateConversion = (
  obj: transformKeysToCamelCaseType | null
): CamelCaseObject | null => {
  if (obj === null) {
    return null; // Handle null values
  }
  if (typeof obj !== "object") {
    return obj as CamelCaseObject; // Handle non-object values
  }

  const result: CamelCaseObject = {};

  for (const key in obj) {
    if (key === "created_at" || key === "updated_at") {
      result[key] = (obj[key] as Date).toISOString();
      continue;
    }
    if (key === "_id") {
      result["id"] = obj[key];
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = snakeToCamel(key);
      result[newKey] = camelCaseifyWithDateConversion(
        obj[key] as transformKeysToCamelCaseType
      );
    }
  }
  return result;
};
