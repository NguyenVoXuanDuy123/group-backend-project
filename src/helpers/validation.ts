import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import NotEmptyError from "@src/error/NotEmptyError";
import NotNullError from "@src/error/NotNullError";

type InputNotNullValidator = {
  [key: string]: unknown;
};

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

export const validateUsername = (username: string): void => {
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(username)) throw new ApiError(ApiErrorCodes.INVALID_USERNAME);
};

export const validateDate = (dateString: string): void => {
  const date = new Date(dateString);
  if (!date.getTime()) throw new ApiError(ApiErrorCodes.INVALID_DATE);
};
