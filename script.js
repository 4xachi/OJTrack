/* 
  OJTrack Showcase Website Interactive Scripts
  Calculates dynamic OJT completion dates, manages FAQ accordions,
  and handles smooth scroll interactions.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Clean hash from URL on initial load if present
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname + window.location.search);
  }

  initMobileMenu();
  initCleanSmoothScroll();
  initCalculator();
  initFaqAccordion();
  initNavbarScroll();
  initIntersectionObserver();
});

// Interactive OJT Completion Date Calculator
function initCalculator() {
  const reqHoursInput = document.getElementById('reqHours');
  const loggedHoursInput = document.getElementById('loggedHours');
  const dailyHoursInput = document.getElementById('dailyHours');
  const workDaysSelect = document.getElementById('workDays');

  const resFinishDate = document.getElementById('resFinishDate');
  const resRemainingDays = document.getElementById('resRemainingDays');

  function calculateFinishDate() {
    const req = parseFloat(reqHoursInput.value) || 500;
    const logged = parseFloat(loggedHoursInput.value) || 0;
    const daily = parseFloat(dailyHoursInput.value) || 8;
    const daysPerWeek = parseInt(workDaysSelect.value) || 5;

    const remainingHours = Math.max(0, req - logged);
    if (remainingHours <= 0) {
      resFinishDate.textContent = 'Target Hours Achieved';
      resRemainingDays.textContent = '0 workdays remaining';
      return;
    }

    const neededWorkdays = Math.ceil(remainingHours / daily);
    let currentDate = new Date();
    let daysAdded = 0;

    // Simulate workdays forward based on selected weekly schedule
    while (daysAdded < neededWorkdays) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 6 is Saturday

      if (daysPerWeek === 5) {
        // Mon-Fri (1-5)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          daysAdded++;
        }
      } else if (daysPerWeek === 6) {
        // Mon-Sat (1-6)
        if (dayOfWeek !== 0) {
          daysAdded++;
        }
      } else {
        // 7 days/week
        daysAdded++;
      }
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    resFinishDate.textContent = currentDate.toLocaleDateString('en-US', options);
    resRemainingDays.textContent = `~${neededWorkdays} workdays remaining at ${daily}h/day pace`;
  }

  [reqHoursInput, loggedHoursInput, dailyHoursInput, workDaysSelect].forEach(element => {
    if (element) {
      element.addEventListener('input', calculateFinishDate);
      element.addEventListener('change', calculateFinishDate);
    }
  });

  calculateFinishDate();
}

// FAQ Accordion Toggle
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');

      // Close all active items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Navbar Scroll Effect
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(11, 15, 25, 0.9)';
      navbar.style.boxShadow = '0 12px 36px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(11, 15, 25, 0.75)';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    }
  });
}

// Intersection Observer for Scroll Animations
function initIntersectionObserver() {
  const animatedElements = document.querySelectorAll('.glass-panel, .comp-card, .mvg-card, .feature-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

// Mobile Hamburger Menu Toggle
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

// Clean Smooth Scroll (Prevents URL Hash #about, #features, etc. in address bar)
function initCleanSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      // Immediately clear hash from address bar while maintaining clean URL
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    });
  });
}
