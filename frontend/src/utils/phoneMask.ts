/**
 * Formats a phone number with Brazilian mask: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
 */
export function formatPhoneWithMask(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  
  // Limit to 11 digits (Brazilian mobile with area code)
  const limited = digits.slice(0, 11);
  
  // Apply mask based on length
  if (limited.length === 0) {
    return "";
  } else if (limited.length <= 2) {
    return `(${limited}`;
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else if (limited.length <= 10) {
    // Landline format: (XX) XXXX-XXXX
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  } else {
    // Mobile format: (XX) XXXXX-XXXX
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
}

/**
 * Extracts only digits from a formatted phone number
 */
export function extractPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Formats phone to E.164 format for API submission
 */
export function formatPhoneE164(phoneNumber: string): string {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  // If already has country code (starts with 55 and has 12-13 digits)
  if (digitsOnly.startsWith("55") && digitsOnly.length >= 12) {
    return `+${digitsOnly}`;
  }
  // Add Brazil country code if not present
  return `+55${digitsOnly}`;
}
