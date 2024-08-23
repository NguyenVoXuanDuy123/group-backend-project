import { faker } from "@faker-js/faker";

export const randomDate = (startDate: Date) => {
  const endDate = new Date("2024-08-21");
  if (startDate > endDate) startDate = new Date("2024-07-21");
  const randomDate = faker.date.between({ from: startDate, to: endDate });
  return randomDate;
};

export const maxDate = (date1: Date, date2: Date | null | undefined): Date => {
  if (!date2) return date1;
  return new Date(Math.max(date1.getTime(), date2.getTime()));
};

//sanitize username
export const sanitizeUsername = (username: string): string => {
  return username.replace(/[^a-zA-Z0-9]/g, "");
};
