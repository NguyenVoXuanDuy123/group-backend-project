import LengthError from "@src/error/LengthError";
import NotEmptyError from "@src/error/NotEmptyError";
import NotNullError from "@src/error/NotNullError";

import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { Request } from "express";
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
    throw new NotNullError(nullFields.join(", "));
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
  const notNumberFields = [];
  for (const fieldName in input) {
    if (isNaN(Number(input[fieldName]))) {
      throw new IsNotNumberError(fieldName);
    }
  }
};

/**
 * Function to validate if a user is authenticated
 * @param req - The request object
 * @throws ApiError
 */
export const validateIsAuthenticated = (req: Request): void => {
  if (!req.isAuthenticated()) {
    throw new ApiError(ApiErrorCodes.USER_NOT_AUTHENTICATED);
  }
};

/**
 * Function to validate if value in Enum
 * @param input - An Object containing the field name and value and Enum to check against
 * @throws ApiError
 */

// export const validateIsInEnum = <T extends object>(
//   enumObj: T,
//   value: {
//     value: string;
//   }
// ): void => {

//   if (!Object.values(enumObj).includes(value)) {
//     throw new NotInEnumError(value);
//   }
// };
