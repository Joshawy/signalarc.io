// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form dropdown logic
const serviceTypeSelect = document.getElementById('serviceType');
const outreachFields = document.getElementById('outreach-fields');
const contentSynFields = document.getElementById('contentsyn-fields');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Handle service type change
serviceTypeSelect.addEventListener('change', function() {
    const selectedService = this.value;
    
    if (selectedService === 'outreach') {
        outreachFields.style.display = 'block';
        contentSynFields.style.display = 'none';
        
        // Make outreach fields required
        document.getElementById('budget').setAttribute('required', 'required');
        
        // Remove required from content syndication fields
        removeRequiredFromContentSyn();
    } else if (selectedService === 'contentsyn') {
        outreachFields.style.display = 'none';
        contentSynFields.style.display = 'block';
        
        // Remove required from outreach fields
        document.getElementById('budget').removeAttribute('required');
        
        // Make content syndication fields required
        document.getElementById('geographic').setAttribute('required', 'required');
        document.getElementById('jobTitles').setAttribute('required', 'required');
        document.getElementById('companySize').setAttribute('required', 'required');
        document.getElementById('industries').setAttribute('required', 'required');
        document.getElementById('leadVolume').setAttribute('required', 'required');
        document.getElementById('content').setAttribute('required', 'required');
    } else {
        outreachFields.style.display = 'none';
        contentSynFields.style.display = 'none';
        
        // Remove all conditional required attributes
        document.getElementById('budget').removeAttribute('required');
        removeRequiredFromContentSyn();
    }
});

function removeRequiredFromContentSyn() {
    document.getElementById('geographic').removeAttribute('required');
    document.getElementById('jobTitles').removeAttribute('required');
    document.getElementById('companySize').removeAttribute('required');
    document.getElementById('industries').removeAttribute('required');
    document.getElementById('leadVolume').removeAttribute('required');
    document.getElementById('content').removeAttribute('required');
}

// Handle service card CTA clicks to pre-select service
document.querySelectorAll('.service-cta').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const service = this.getAttribute('data-service');
        
        // Scroll to form
        document.getElementById('contact').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Pre-select the service after a short delay
        setTimeout(() => {
            serviceTypeSelect.value = service;
            serviceTypeSelect.dispatchEvent(new Event('change'));
        }, 500);
    });
});

// Handle form submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Log form data (in production, you would send this to your backend)
    console.log('Form submitted with data:', data);
    
    // Show success message
    contactForm.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Optional: Send to backend
    // You can integrate with services like:
    // - Formspree: https://formspree.io/
    // - Basin: https://usebasin.com/
    // - Your own backend API
    
    /*
    fetch('YOUR_FORM_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error submitting the form. Please try again.');
    });
    */
    
    // Scroll to success message
    setTimeout(() => {
        successMessage.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
});

// Add scroll effect to navigation
let lastScrollTop = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', function() {
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

// Add CSS for nav transform
nav.style.transition = 'transform 0.3s ease';
