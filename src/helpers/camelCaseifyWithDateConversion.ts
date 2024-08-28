/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Types } from "mongoose";

type CamelCaseObject = {
  [key: string]: unknown;
};
export type TransformKeysToCamelCaseType = {
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
  obj: TransformKeysToCamelCaseType | null
): CamelCaseObject | null => {
  if (obj === null) {
    return null; // Handle null values
  }
  if (typeof obj !== "object") {
    return obj as CamelCaseObject; // Handle non-object values
  }

  const result: CamelCaseObject = {};

  for (const key in obj) {
    // if the key is created_at or updated_at, convert the date to ISO string
    if (typeof obj[key] === "object" && obj[key] instanceof Date) {
      result[snakeToCamel(key)] = obj[key].toISOString();

      continue;
    }

    // if the key is _id, convert it to id
    if (key === "_id") {
      result["id"] = obj[key];
      continue;
    }

    // if the key is an ObjectId just convert it to camelCase and add it to the result
    if (obj[key] instanceof Types.ObjectId) {
      result[snakeToCamel(key)] = obj[key];
      continue;
    }

    // if the key is an array, convert it to camelCase and add it to the result
    if (Array.isArray(obj[key])) {
      result[snakeToCamel(key)] = obj[key].map((item) => {
        if (item instanceof Types.ObjectId) return item;
        if (typeof item !== "object") return item;
        return camelCaseifyWithDateConversion(item);
      });
      continue;
    }

    // if the key is an object, convert it to camelCase and convert its children to camelCase by recursion
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = snakeToCamel(key);
      result[newKey] = camelCaseifyWithDateConversion(
        obj[key] as TransformKeysToCamelCaseType
      );
    }
  }
  return result;
};
