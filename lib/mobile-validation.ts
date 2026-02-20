// lib/mobile-validation.ts

/**
 * Validates an Indian mobile number.
 * - Must be exactly 10 digits long.
 * - Must start with 6, 7, 8, or 9.
 * - Cannot contain more than 7 identical consecutive digits (e.g., 9999999999).
 * - Cannot contain more than 7 consecutive digits in ascending or descending order (e.g., 1234567890, 9876543210).
 * @param mobileNumber The mobile number string to validate.
 * @returns Object with isValid boolean and error message if invalid.
 */
export const validateIndianMobileNumber = (mobileNumber: string): { isValid: boolean; error?: string } => {
  if (!mobileNumber) {
    return { isValid: true }; // Optional field
  }

  // Remove any non-digit characters for validation
  const cleanedNumber = mobileNumber.replace(/\D/g, '');

  // 1. Must be exactly 10 digits long
  if (cleanedNumber.length !== 10) {
    return { isValid: false, error: 'Mobile number must be exactly 10 digits' };
  }

  // 2. Must start with 6, 7, 8, or 9
  if (!/^[6-9]/.test(cleanedNumber)) {
    return { isValid: false, error: 'Mobile number must start with 6, 7, 8, or 9' };
  }

  // 3. Cannot contain more than 7 identical consecutive digits
  if (/(.)\1{7}/.test(cleanedNumber)) {
    return { isValid: false, error: 'Invalid mobile number pattern (too many repeated digits)' };
  }

  // 4. Cannot contain more than 7 consecutive digits in ascending or descending order
  // Check for ascending sequences (e.g., 12345678, 23456789)
  for (let i = 0; i <= cleanedNumber.length - 8; i++) {
    const segment = cleanedNumber.substring(i, i + 8);
    if ('0123456789'.includes(segment) || '1234567890'.includes(segment)) {
      return { isValid: false, error: 'Invalid mobile number pattern (sequential digits)' };
    }
  }

  // Check for descending sequences (e.g., 87654321, 98765432)
  for (let i = 0; i <= cleanedNumber.length - 8; i++) {
    const segment = cleanedNumber.substring(i, i + 8);
    if ('9876543210'.includes(segment) || '876543210'.includes(segment)) {
      return { isValid: false, error: 'Invalid mobile number pattern (sequential digits)' };
    }
  }

  return { isValid: true };
};

/**
 * Formats a mobile number for display or input by ensuring it's a string
 * and removing non-digit characters.
 * @param mobileNumber The mobile number to format (can be string or number).
 * @returns A cleaned string containing only digits, or an empty string if input is invalid.
 */
export const formatMobileNumberForInput = (mobileNumber: string | number): string => {
  if (mobileNumber === null || mobileNumber === undefined) {
    return '';
  }
  return String(mobileNumber).replace(/\D/g, '');
};

/**
 * Simple validation for Indian mobile number
 * @param mobileNumber The mobile number string to validate.
 * @returns True if valid Indian mobile number, false otherwise.
 */
export const isValidIndianMobileNumber = (mobileNumber: string): boolean => {
  if (!mobileNumber) return true; // Optional field
  const cleaned = mobileNumber.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
};
