export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long',
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      valid: false,
      error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    };
  }

  return { valid: true };
}

export function validateDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      valid: false,
      error: 'Invalid date format',
    };
  }

  if (end < start) {
    return {
      valid: false,
      error: 'End date must be after or equal to start date',
    };
  }

  return { valid: true };
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000);
}