/* 
  OJTrack — Interactive Web Application Engine
  Handles real-time OJT finish date calculations, interactive device mockup tab switching,
  FAQ accordion toggles, scroll animations, and clean navigation.
*/

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAppTabs();
  initCalculator();
  initFaqAccordion();
  initScrollAnimations();
  initCleanSmoothScroll();
});

// Interactive Device Frame App Tab Switcher
function initAppTabs() {
  const tabBtns = document.querySelectorAll('.app-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(`pane-${targetTab}`);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });
}

// Real-Time OJT Completion Date Calculator Engine
function initCalculator() {
  const reqHoursInput = document.getElementById('reqHours');
  const loggedHoursInput = document.getElementById('loggedHours');
  const dailyHoursInput = document.getElementById('dailyHours');
  const dailyHoursVal = document.getElementById('dailyHoursVal');
  const workDaysSelect = document.getElementById('workDays');

  const resFinishDate = document.getElementById('resFinishDate');
  const resRemainingDays = document.getElementById('resRemainingDays');
  const resPercentageText = document.getElementById('resPercentageText');
  const resBarFill = document.getElementById('resBarFill');
  const resRemainingHours = document.getElementById('resRemainingHours');
  const resWorkdaysNeeded = document.getElementById('resWorkdaysNeeded');

  function calculateFinishDate() {
    const req = Math.max(1, parseFloat(reqHoursInput.value) || 500);
    const logged = Math.max(0, parseFloat(loggedHoursInput.value) || 0);
    const daily = Math.max(1, parseFloat(dailyHoursInput.value) || 8);
    const daysPerWeek = parseInt(workDaysSelect.value) || 5;

    // Update range slider text badge
    if (dailyHoursVal) {
      dailyHoursVal.textContent = `${daily.toFixed(1)} hrs/day`;
    }

    const remainingHours = Math.max(0, req - logged);
    const percent = Math.min(100, Math.max(0, (logged / req) * 100));

    // Update Progress UI
    if (resPercentageText) resPercentageText.textContent = `${percent.toFixed(1)}%`;
    if (resBarFill) resBarFill.style.width = `${percent.toFixed(1)}%`;
    if (resRemainingHours) resRemainingHours.textContent = `${remainingHours.toFixed(1)} hrs`;

    if (remainingHours <= 0) {
      if (resFinishDate) resFinishDate.textContent = '🎉 Target Completed!';
      if (resRemainingDays) resRemainingDays.textContent = '0 workdays remaining — Congratulations!';
      if (resWorkdaysNeeded) resWorkdaysNeeded.textContent = '0 days';
      return;
    }

    const neededWorkdays = Math.ceil(remainingHours / daily);
    if (resWorkdaysNeeded) resWorkdaysNeeded.textContent = `~${neededWorkdays} days`;

    // Simulate dates skipping rest days
    let currentDate = new Date();
    let daysAdded = 0;

    while (daysAdded < neededWorkdays) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dayOfWeek = currentDate.getDay(); // 0 = Sun, 6 = Sat

      if (daysPerWeek === 5) {
        if (dayOfWeek !== 0 && dayOfWeek !== 6) daysAdded++;
      } else if (daysPerWeek === 6) {
        if (dayOfWeek !== 0) daysAdded++;
      } else {
        daysAdded++;
      }
    }

    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);

    if (resFinishDate) resFinishDate.textContent = formattedDate;
    if (resRemainingDays) {
      resRemainingDays.textContent = `Paced at ${daily}h/day across ${neededWorkdays} workdays (${daysPerWeek} days/week schedule)`;
    }
  }

  [reqHoursInput, loggedHoursInput, dailyHoursInput, workDaysSelect].forEach(el => {
    if (el) {
      el.addEventListener('input', calculateFinishDate);
      el.addEventListener('change', calculateFinishDate);
    }
  });

  calculateFinishDate();
}

// Accordion Toggle Logic
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Scroll Entrance Observer Animations
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('.bento-card, .comp-box, .calculator-card-glass, .download-card-glass');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  animatedEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

// Mobile Navbar Hamburger Toggle
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

// Clean Smooth Scroll
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

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    });
  });
}
