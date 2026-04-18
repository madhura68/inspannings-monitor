const TIME_VALUE_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const EMAIL_VALUE_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class FormDataValidationError extends Error {
  code: string;

  constructor(code: string) {
    super(code);
    this.code = code;
    this.name = "FormDataValidationError";
  }
}

function fail(code: string): never {
  throw new FormDataValidationError(code);
}

export function getOptionalString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

export function getRequiredString(
  formData: FormData,
  key: string,
  errorCode: string,
): string {
  const value = formData.get(key);

  if (typeof value !== "string") {
    fail(errorCode);
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    fail(errorCode);
  }

  return trimmedValue;
}

export function getBooleanValue(
  formData: FormData,
  key: string,
  errorCode: string,
): boolean {
  const value = formData.get(key);

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  fail(errorCode);
}

export function getEnumValue<const TValue extends string>(
  formData: FormData,
  key: string,
  allowedValues: readonly TValue[],
  errorCode: string,
): TValue {
  const value = getRequiredString(formData, key, errorCode);

  if (!allowedValues.includes(value as TValue)) {
    fail(errorCode);
  }

  return value as TValue;
}

export function getOptionalTimeValue(
  formData: FormData,
  key: string,
  errorCode: string,
): string | null {
  const value = getOptionalString(formData, key);

  if (!value) {
    return null;
  }

  if (!TIME_VALUE_PATTERN.test(value)) {
    fail(errorCode);
  }

  return value;
}

export function assertEmail(value: string, errorCode: string): string {
  if (!EMAIL_VALUE_PATTERN.test(value)) {
    fail(errorCode);
  }

  return value;
}

export function assertMinLength(
  value: string,
  minimumLength: number,
  errorCode: string,
): string {
  if (value.length < minimumLength) {
    fail(errorCode);
  }

  return value;
}
