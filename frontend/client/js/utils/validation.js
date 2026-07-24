function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function validatePassword(password) {
  return password.length >= 8;
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (score <= 2) return { level: 'weak', label: 'Weak', color: 'var(--danger-red)', width: '25%' };
  if (score <= 4) return { level: 'medium', label: 'Medium', color: 'var(--warning-amber)', width: '50%' };
  if (score <= 5) return { level: 'strong', label: 'Strong', color: 'var(--primary-blue)', width: '75%' };
  return { level: 'very-strong', label: 'Very Strong', color: 'var(--success-green)', width: '100%' };
}

function validateRequired(value) {
  return value && value.trim().length > 0;
}

function showFieldError(input, message) {
  input.classList.add('error');
  const existing = input.parentElement.querySelector('.field-error');
  if (existing) existing.remove();
  const err = document.createElement('span');
  err.className = 'field-error';
  err.style.cssText = 'color: var(--danger-red); font-size: var(--text-xs); margin-top: 4px; display: block;';
  err.textContent = message;
  input.parentElement.appendChild(err);
}

function clearFieldError(input) {
  input.classList.remove('error');
  const existing = input.parentElement.querySelector('.field-error');
  if (existing) existing.remove();
}

function validateForm(rules) {
  let valid = true;
  const firstError = [];
  rules.forEach(({ input, validate, message }) => {
    clearFieldError(input);
    if (!validate(input.value)) {
      showFieldError(input, message);
      valid = false;
      if (!firstError.length) firstError.push(input);
    }
  });
  if (firstError.length) firstError[0].focus();
  return valid;
}