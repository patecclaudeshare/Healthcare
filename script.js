/* =========================================================
   1. MOBILE NAV TOGGLE
   ========================================================= */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close the mobile menu after a link is clicked
navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================================
   2. SCROLL FADE-IN ANIMATION
   ========================================================= */
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

fadeElements.forEach((el) => fadeInObserver.observe(el));

/* =========================================================
   3. ENQUIRY FORM VALIDATION & SUBMISSION
   ========================================================= */
const enquiryForm = document.getElementById('enquiryForm');
const formSuccess = document.getElementById('formSuccess');

const fields = {
  fullName: {
    input: document.getElementById('fullName'),
    error: document.getElementById('fullNameError'),
    validate: (value) => value.trim().length > 0,
    message: 'Please enter your full name.',
  },
  email: {
    input: document.getElementById('email'),
    error: document.getElementById('emailError'),
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: 'Please enter a valid email address.',
  },
  phone: {
    input: document.getElementById('phone'),
    error: document.getElementById('phoneError'),
    validate: (value) => /^[\d\s()+-]{7,}$/.test(value.trim()),
    message: 'Please enter a valid phone number.',
  },
};

function clearFieldError(field) {
  field.input.classList.remove('is-invalid');
  field.error.textContent = '';
}

function setFieldError(field) {
  field.input.classList.add('is-invalid');
  field.error.textContent = field.message;
}

function validateField(key) {
  const field = fields[key];
  const isValid = field.validate(field.input.value);

  if (isValid) {
    clearFieldError(field);
  } else {
    setFieldError(field);
  }

  return isValid;
}

// Validate on blur so users get feedback before submitting
Object.keys(fields).forEach((key) => {
  fields[key].input.addEventListener('blur', () => validateField(key));
});

enquiryForm.addEventListener('submit', (e) => {
  e.preventDefault();

  formSuccess.hidden = true;

  const results = Object.keys(fields).map((key) => validateField(key));
  const allValid = results.every(Boolean);

  if (!allValid) {
    // Move focus to the first invalid field for accessibility
    const firstInvalidKey = Object.keys(fields).find((key) => !fields[key].validate(fields[key].input.value));
    fields[firstInvalidKey].input.focus();
    return;
  }

  const formData = {
    fullName: fields.fullName.input.value.trim(),
    email: fields.email.input.value.trim(),
    phone: fields.phone.input.value.trim(),
    preferredDate: document.getElementById('preferredDate').value,
    message: document.getElementById('message').value.trim(),
  };

  // ---------------------------------------------------------
  // TODO: Replace this with a real API call, e.g.:
  // fetch('/api/appointments', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(formData),
  // });
  // ---------------------------------------------------------
  console.log('Appointment request submitted:', formData);

  formSuccess.hidden = false;
  enquiryForm.reset();
  Object.keys(fields).forEach((key) => clearFieldError(fields[key]));
});

/* =========================================================
   4. FOOTER YEAR
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();
