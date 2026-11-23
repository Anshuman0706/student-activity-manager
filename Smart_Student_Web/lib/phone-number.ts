export function isValidMobileNumber(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  return (
    /^\+?[0-9 ()-]+$/.test(trimmed) &&
    digits.length >= 7 &&
    digits.length <= 15
  );
}
