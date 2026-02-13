// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const target = document.querySelector(href);

    // Only intercept if the target exists on the page
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});


// ---------------------------
// Contact form conditional logic + submit
// ---------------------------
const serviceTypeSelect = document.getElementById('serviceType');
const outreachFields = document.getElementById('outreach-fields');
const contentSynFields = document.getElementById('contentsyn-fields');
const contactForm = document.getElementById('contactForm');

// If these elements aren't on this page, stop here safely.
if (serviceTypeSelect && outreachFields && contentSynFields && contactForm) {

  const budgetEl = document.getElementById('budget');

  const contentRequiredEls = [
    document.getElementById('geographic'),
    document.getElementById('jobTitles'),
    document.getElementById('companySize'),
    document.getElementById('industries'),
    document.getElementById('leadVolume'),
    document.getElementById('content'),
  ].filter(Boolean);

  function setRequired(el, isRequired) {
    if (!el) return;
    if (isRequired) el.setAttribute('required', 'required');
    else el.removeAttribute('required');
  }

  function setRequiredGroup(els, isRequired) {
    els.forEach(el => setRequired(el, isRequired));
  }

  function showOutreach() {
    outreachFields.style.display = 'block';
    contentSynFields.style.display = 'none';

    setRequired(budgetEl, true);
    setRequiredGroup(contentRequiredEls, false);
  }

  function showContentSyn() {
    outreachFields.style.display = 'none';
    contentSynFields.style.display = 'block';

    setRequired(budgetEl, false);
    setRequiredGroup(contentRequiredEls, true);
  }

  function hideAllConditional() {
    outreachFields.style.display = 'none';
    contentSynFields.style.display = 'none';

    setRequired(budgetEl, false);
    setRequiredGroup(contentRequiredEls, false);
  }

  // Handle service type change
  serviceTypeSelect.addEventListener('change', function () {
    const selectedService = this.value;

    if (selectedService === 'outreach') {
      showOutreach();
    } else if (selectedService === 'contentsyn') {
      showContentSyn();
    } else {
      hideAllConditional();
    }
  });

  // Set initial state on page load (important if browser keeps selection)
  if (serviceTypeSelect.value === 'outreach') showOutreach();
  else if (serviceTypeSelect.value === 'contentsyn') showContentSyn();
  else hideAllConditional();


  // Handle service card CTA clicks to pre-select service
  document.querySelectorAll('.service-cta').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const service = this.getAttribute('data-service');

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }

      setTimeout(() => {
        serviceTypeSelect.value = service;
        serviceTypeSelect.dispatchEvent(new Event('change'));
      }, 350);
    });
  });


  // Handle form submission -> Formspree -> redirect to thank-you page
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Trigger built-in validation UI
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);

    try {
      const response = await fetch('https://formspree.io/f/xreaplzq', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // IMPORTANT: if your site is in a subfolder, change this path.
        // Examples:
        // window.location.href = "/thank-you.html";
        // window.location.href = "/signalarc.io/thank-you.html";
        window.location.href = "/thank-you.html";
      } else {
        alert('There was an error submitting the form. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  });
}


// ---------------------------
// Navigation hide/show on scroll
// ---------------------------
const nav = document.querySelector('.nav');
if (nav) {
  let lastScrollTop = 0;
  nav.style.transition = 'transform 0.3s ease';

  window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      nav.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      nav.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
  }, false);
}
