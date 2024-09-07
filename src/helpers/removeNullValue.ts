type PlainObject = { [key: string]: unknown };

export const removeNullValues = (obj: PlainObject): PlainObject => {
  if (obj === null) {
    return {}; // Handle null values
  }

  // Create a new object to store filtered key-value pairs
  const result: PlainObject = {};

  // Iterate through the object's keys
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== null) {
        // Add property to result if value is not null
        result[key] = value;
      }
    }
  }

  return result;
};
