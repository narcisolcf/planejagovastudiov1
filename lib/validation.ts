/**
 * Password validation utilities
 */

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let strengthScore = 0;

  // Minimum length check
  if (password.length < 8) {
    errors.push('A senha deve ter no mínimo 8 caracteres');
  } else {
    strengthScore += 1;
    if (password.length >= 12) strengthScore += 1;
  }

  // Uppercase letter check
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  } else {
    strengthScore += 1;
  }

  // Lowercase letter check
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  } else {
    strengthScore += 1;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  } else {
    strengthScore += 1;
  }

  // Special character check (optional but increases strength)
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    strengthScore += 1;
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (strengthScore >= 5) {
    strength = 'strong';
  } else if (strengthScore >= 3) {
    strength = 'medium';
  }

  return {
    valid: errors.length === 0,
    errors,
    strength
  };
};

/**
 * Email validation
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
