// =========================================================
// AI Growth Agents — Main JS
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sticky header scroll effect ---------- */
  var header = document.getElementById('site-header');
  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  /* ---------- Mobile menu toggle ---------- */
  var menuBtn = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  menuBtn.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
    var icon = menuBtn.querySelector('i');
    if (mobileMenu.classList.contains('open')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  // Close mobile menu when a link is clicked
  var mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      var icon = menuBtn.querySelector('i');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    });
  });

  /* ---------- Fade-in on scroll animation ---------- */
  var animatedEls = document.querySelectorAll(
    '.agent-card, .service-card, .industry-card, .trust-card, .whyus-card, .integration-card, .pricing-card, .testimonial-card, .timeline-step'
  );
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    animatedEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  /* ---------- ROI Calculator ---------- */
  var employeesInput = document.getElementById('roi-employees');
  var leadsInput = document.getElementById('roi-leads');
  var inquiriesInput = document.getElementById('roi-inquiries');
  var hoursInput = document.getElementById('roi-hours');
  var costInput = document.getElementById('roi-cost');

  var hoursSavedEl = document.getElementById('roi-hours-saved');
  var costSavingsEl = document.getElementById('roi-cost-savings');
  var leadsOppEl = document.getElementById('roi-leads-opportunities');
  var annualImpactEl = document.getElementById('roi-annual-impact');

  function calcROI() {
    var employees = parseFloat(employeesInput.value) || 0;
    var leads = parseFloat(leadsInput.value) || 0;
    var inquiries = parseFloat(inquiriesInput.value) || 0;
    var hoursPerWeek = parseFloat(hoursInput.value) || 0;
    var hourlyCost = parseFloat(costInput.value) || 0;

    // Illustrative estimate formulas only
    var automationRate = 0.6; // assume 60% of repetitive hours automatable
    var monthlyHoursSaved = employees * hoursPerWeek * 4.33 * automationRate;
    var monthlyCostSavings = monthlyHoursSaved * hourlyCost;
    var additionalLeadOpportunities = Math.round((leads + inquiries * 0.3) * 0.25);
    var annualImpact = monthlyCostSavings * 12;

    hoursSavedEl.textContent = Math.round(monthlyHoursSaved).toLocaleString();
    costSavingsEl.textContent = '$' + Math.round(monthlyCostSavings).toLocaleString();
    leadsOppEl.textContent = additionalLeadOpportunities.toLocaleString();
    annualImpactEl.textContent = '$' + Math.round(annualImpact).toLocaleString();
  }

  [employeesInput, leadsInput, inquiriesInput, hoursInput, costInput].forEach(function (input) {
    if (input) {
      input.addEventListener('input', calcROI);
    }
  });
  if (employeesInput) {
    calcROI();
  }

  /* ---------- Contact form (saves to Supabase "leadblaster" table) ---------- */
  var contactForm = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var formData = new FormData(contactForm);

      var servicesSelected = Array.prototype.slice
        .call(contactForm.querySelector('select[name="services"]').selectedOptions)
        .map(function (opt) { return opt.value; });

      var lead = {
        full_name: formData.get('full_name'),
        business_name: formData.get('business_name') || null,
        email: formData.get('email'),
        phone: formData.get('phone') || null,
        website: formData.get('website') || null,
        industry: formData.get('industry') || null,
        services_interested: servicesSelected.join(', ') || null,
        message: formData.get('message') || null
      };

      if (submitBtn) { submitBtn.disabled = true; }
      formStatus.textContent = 'Sending...';

      supabaseClient
        .from('leadblaster')
        .insert([lead])
        .then(function (result) {
          if (result.error) {
            console.error('Supabase insert error:', result.error);
            formStatus.textContent =
              "Something went wrong sending your request. Please email us at info.mahu.manager@gmail.com or message us on WhatsApp.";
          } else {
            formStatus.textContent =
              "Thanks! Your request has been received — we'll get back to you shortly.";
            contactForm.reset();
          }
        })
        .catch(function (err) {
          console.error('Supabase insert exception:', err);
          formStatus.textContent =
            "Something went wrong sending your request. Please email us at info.mahu.manager@gmail.com or message us on WhatsApp.";
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; }
        });
    });
  }

});
