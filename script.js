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
const formError = document.getElementById('formError');
const formSubmitBtn = document.getElementById('formSubmitBtn');

// Web3Forms access key — get yours free at https://web3forms.com/ (no account needed)
const WEB3FORMS_ACCESS_KEY = '383258';

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

enquiryForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  formSuccess.hidden = true;
  formError.hidden = true;

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

  formSubmitBtn.disabled = true;
  formSubmitBtn.textContent = 'Sending...';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'New appointment request — Willowbrook Clinic',
        from_name: formData.fullName,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        preferred_date: formData.preferredDate,
        message: formData.message,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Submission failed');
    }

    formSuccess.hidden = false;
    enquiryForm.reset();
    Object.keys(fields).forEach((key) => clearFieldError(fields[key]));
  } catch (err) {
    console.error('Appointment request failed:', err);
    formError.hidden = false;
  } finally {
    formSubmitBtn.disabled = false;
    formSubmitBtn.textContent = 'Submit Request';
  }
});

/* =========================================================
   4. NEXT AVAILABLE APPOINTMENT SLOT (hero trust chip)
   ========================================================= */
function nextAvailableSlot() {
  const slot = new Date();
  slot.setHours(9, 40, 0, 0);

  // Push to tomorrow, then skip forward over weekends.
  slot.setDate(slot.getDate() + 1);
  while (slot.getDay() === 0 || slot.getDay() === 6) {
    slot.setDate(slot.getDate() + 1);
  }

  const formatted = slot.toLocaleDateString('en-US', { weekday: 'long' }) +
    ', ' + slot.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  document.getElementById('nextSlot').textContent = formatted;
}

nextAvailableSlot();

/* =========================================================
   5. LEAD MAGNET: FAMILY WELLNESS CHECKLIST
   ========================================================= */
const checklistForm = document.getElementById('checklistForm');
const checklistSuccess = document.getElementById('checklistSuccess');
const checklistEmail = document.getElementById('checklistEmail');
const checklistEmailError = document.getElementById('checklistEmailError');

const CHECKLIST_CONTENT = `WILLOWBROOK FAMILY CLINIC
The Family Wellness Checklist

AGE-BY-AGE SCREENING & VACCINATION SCHEDULE
- Infants (0-1yr): Well-baby visits at 2, 4, 6, 9, and 12 months
- Children (1-12yr): Annual checkup + vision/hearing screen; vaccines per CDC schedule
- Teens (13-18yr): Annual checkup; sports physicals as needed
- Adults (19-64yr): Checkup every 1-2 years; blood pressure and cholesterol screening
- Adults (65+): Annual checkup; bone density and cardiovascular screening

WHEN A SYMPTOM WARRANTS A SAME-WEEK VISIT
- Fever lasting more than 3 days
- Persistent pain that disrupts sleep or daily activity
- Any new lump, rash, or symptom that is worsening
- Shortness of breath with everyday activity

QUESTIONS WORTH ASKING AT YOUR NEXT CHECKUP
- Are my vaccinations up to date?
- What screenings make sense for my age and family history?
- Are there any medication interactions I should know about?
- What's one habit I could change that would matter most?

Willowbrook Family Clinic - 128 Maple Street, Springfield
(555) 234-7890 - hello@willowbrookclinic.example
`;

function validateChecklistEmail() {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checklistEmail.value.trim());

  if (isValid) {
    checklistEmail.classList.remove('is-invalid');
    checklistEmailError.textContent = '';
  } else {
    checklistEmail.classList.add('is-invalid');
    checklistEmailError.textContent = 'Please enter a valid email address.';
  }

  return isValid;
}

checklistEmail.addEventListener('blur', validateChecklistEmail);

checklistForm.addEventListener('submit', (e) => {
  e.preventDefault();

  checklistSuccess.hidden = true;

  if (!validateChecklistEmail()) {
    checklistEmail.focus();
    return;
  }

  // ---------------------------------------------------------
  // TODO: Replace this with a real API call to an email service, e.g.:
  // fetch('/api/leads', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email: checklistEmail.value.trim(), source: 'family-wellness-checklist' }),
  // });
  // ---------------------------------------------------------
  console.log('Checklist requested by:', checklistEmail.value.trim());

  const blob = new Blob([CHECKLIST_CONTENT], { type: 'text/plain' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'willowbrook-family-wellness-checklist.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);

  checklistSuccess.hidden = false;
  checklistForm.reset();
});

/* =========================================================
   6. FOOTER YEAR
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   7. FLOATING WHATSAPP WIDGET
   ========================================================= */
const whatsappToggle = document.getElementById('whatsappToggle');
const whatsappPanel = document.getElementById('whatsappPanel');
const whatsappClose = document.getElementById('whatsappClose');
const whatsappWidget = document.querySelector('.whatsapp-widget');

function openWhatsappPanel() {
  whatsappPanel.hidden = false;
  whatsappToggle.setAttribute('aria-expanded', 'true');
}

function closeWhatsappPanel() {
  whatsappPanel.hidden = true;
  whatsappToggle.setAttribute('aria-expanded', 'false');
}

whatsappToggle.addEventListener('click', () => {
  if (whatsappPanel.hidden) {
    openWhatsappPanel();
  } else {
    closeWhatsappPanel();
  }
});

whatsappClose.addEventListener('click', () => {
  closeWhatsappPanel();
  whatsappToggle.focus();
});

document.addEventListener('click', (e) => {
  if (!whatsappPanel.hidden && !whatsappWidget.contains(e.target)) {
    closeWhatsappPanel();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !whatsappPanel.hidden) {
    closeWhatsappPanel();
    whatsappToggle.focus();
  }
});
