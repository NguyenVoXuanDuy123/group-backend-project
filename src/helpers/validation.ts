import NotEmptyError from "@src/error/NotEmptyError";
import NotNullError from "@src/error/NotNullError";

// export const validateUsername = (username: string): void => {
//   return username;
// };

type InputNotNullValidator = {
  [key: string]: unknown;
};

/**
 * Function to validate not null values
 * @param input - An object containing the field name and value.
 * @throws NotNullError
 */

export const validateNotNull = (input: InputNotNullValidator): void => {
  const nullFields = [];
  for (const fieldName in input) {
    if (input[fieldName] === null || input[fieldName] === undefined) {
      nullFields.push(fieldName);
    }
  }
  if (nullFields.length > 0) {
    throw new NotNullError(nullFields);
  }
};

type InputNotEmptyValidator = {
  [key: string]: string;
};

/**
 * Function to validate not empty values
 * @param input - An object containing the field name and value.
 * @throws NotEmptyError
 */

export const validateNotEmpty = (input: InputNotEmptyValidator): void => {
  const emptyFields = [];
  for (const fieldName in input) {
    if (input[fieldName].trim() === "") {
      emptyFields.push(fieldName);
    }
  }
  if (emptyFields.length > 0) {
    throw new NotEmptyError(emptyFields);
  }
};
