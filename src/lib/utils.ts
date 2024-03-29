/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoremIpsum } from "lorem-ipsum";
import uniqueId from "lodash/uniqueId";

export const createLoremIpsum = (sMax = 3, sMin = 1, wMax = 10, wMin = 5) => {
  const loremIpsum = new LoremIpsum({
    sentencesPerParagraph: {
      max: sMax,
      min: sMin,
    },
    wordsPerSentence: {
      max: wMax,
      min: wMin,
    },
  });
  return loremIpsum;
};

export const getRandomNumber = (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min;
export const getRandomPhone = () => getRandomNumber(1000000000, 9999999999).toString();
export const getRandomAbcLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
export const getRandomBoolean = () => Math.random() >= 0.5;

export const getRandomDate = (hoursOffset = 0, dayOffset = 0, yearOffset = 0) => {
  const date = new Date();
  date.setHours(date.getHours() + hoursOffset);
  date.setDate(date.getDate() + dayOffset);
  date.setFullYear(date.getFullYear() + yearOffset);
  return date;
};

export const getRandomNonRepeatedIds = (qty: number) => {
  const ids: string[] = [];

  while (ids.length < qty) {
    const randomId = uniqueId();
    if (!ids.includes(randomId)) {
      ids.push(randomId);
    }
  }
  return ids;
};

export const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    timeout = setTimeout(() => func(...args), wait);
  };
};

type ErrorWithMessage = {
  message: string;
};

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
};

export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};

