import NotEmptyError from "@src/error/NotEmptyError";
import LengthError from "@src/error/LengthError";
import NotNullError from "@src/error/NotNullError";

import IsNotNumberError from "@src/error/IsNotNumberError";

// export const validateUsername = (username: string): void => {
//   return username;
// };

type InputLengthValidator = {
  [key: string]: {
    value: string;
    minLength?: number;
    maxLength?: number;
  };
};
/**
 * Function to validate the length of a string
 * @param input - An object containing the field name, value, and optional min and max length.
 * @throws LengthError
 */

export const validateLength = (input: InputLengthValidator): void => {
  for (const fieldName in input) {
    const { value, minLength, maxLength } = input[fieldName];
    if (minLength !== undefined && value.length < minLength) {
      throw new LengthError(fieldName, minLength, maxLength);
    } else if (maxLength !== undefined && value.length > maxLength) {
      throw new LengthError(fieldName, minLength, maxLength);
    }
  }
};

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
    throw new NotEmptyError(emptyFields.join(", "));
  }
};

type InputIsNumberValidator = {
  [key: string]: unknown;
};

/**
 * Function to validate if a value is a number
 * @param input - An object containing the field name and value.
 * @throws IsNotNumberError
 */

export const validateIsNumber = (input: InputIsNumberValidator): void => {
  for (const fieldName in input) {
    if (isNaN(Number(input[fieldName]))) {
      throw new IsNotNumberError(fieldName);
    }
  }
};

// type InputIsStringValidator = {
//   [key: string]: unknown;
// };

/**
 * Function to validate if a value is string
 * @param input - An object containing the field name and value.
 * @throws IsNotStringError
 */

// export const validateIsString = (input: InputIsStringValidator): void => {
//   for (const fieldName in input) {
//     if (typeof input[fieldName] !== "string") {
//       throw new IsNotStringError(fieldName);
//     }
//   }
// };
