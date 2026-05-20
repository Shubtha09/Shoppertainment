const header = document.querySelector("[data-header]");
const menuPanel = document.querySelector("[data-menu-panel]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");
const tiltPanel = document.querySelector("[data-tilt]");
const stepsGrid = document.querySelector(".steps-grid");
const revealTargets = document.querySelectorAll(
  ".hero-copy > *, .statement-strip, .section-label, h2, .story-grid p, .capability-list article, .console-card, .console-copy p, .case-grid article, .study-card, .industry-grid article, .steps-grid article, .mini-grid article, .trust-stats article, .brand-showcase, .testimonial-grid blockquote, .contact-form"
);
const contactForm = document.querySelector(".contact-form");
const customCursor = document.querySelector("[data-cursor]");
const pageIntro = document.querySelector("[data-page-intro]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const setMenu = (isOpen) => {
  menuPanel.classList.toggle("is-open", isOpen);
  menuPanel.setAttribute("aria-hidden", String(!isOpen));
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
};

menuToggle.addEventListener("click", () => setMenu(true));
menuClose.addEventListener("click", () => setMenu(false));

menuPanel.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (pageIntro) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const introSeen = window.sessionStorage.getItem("shoppertainmentIntroSeen") === "true";

  if (introSeen || reduceMotion) {
    pageIntro.classList.add("is-hidden");
  } else {
    window.setTimeout(() => {
      pageIntro.classList.add("is-exiting");
    }, 1850);

    window.setTimeout(() => {
      pageIntro.classList.add("is-hidden");
      window.sessionStorage.setItem("shoppertainmentIntroSeen", "true");
    }, 2850);
  }
}

if (customCursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const interactiveSelector = "a, button, label, [role='button']";
  const textSelector = "input, textarea";
  let cursorX = -40;
  let cursorY = -40;
  let trailX = -40;
  let trailY = -40;

  const animateCursorTrail = () => {
    trailX += (cursorX - trailX) * 0.18;
    trailY += (cursorY - trailY) * 0.18;
    customCursor.style.setProperty("--cursor-trail-x", `${trailX}px`);
    customCursor.style.setProperty("--cursor-trail-y", `${trailY}px`);
    window.requestAnimationFrame(animateCursorTrail);
  };

  animateCursorTrail();

  window.addEventListener("pointermove", (event) => {
    const isTextField = Boolean(event.target.closest(textSelector));
    cursorX = event.clientX;
    cursorY = event.clientY;

    customCursor.style.setProperty("--cursor-x", `${cursorX}px`);
    customCursor.style.setProperty("--cursor-y", `${cursorY}px`);
    customCursor.classList.toggle("is-visible", !isTextField);
    customCursor.classList.toggle("is-active", Boolean(event.target.closest(interactiveSelector)));
  });

  window.addEventListener("pointerleave", () => {
    customCursor.classList.remove("is-visible", "is-active");
  });
}

revealTargets.forEach((target) => target.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((target, index) => {
  target.style.transitionDelay = `${Math.min(index % 5, 4) * 60}ms`;
  observer.observe(target);
});

if (stepsGrid) {
  const stepsObserver = new IntersectionObserver(
    ([entry]) => {
      stepsGrid.classList.toggle("is-connected", entry.isIntersecting);
    },
    { threshold: 0.5 }
  );

  stepsObserver.observe(stepsGrid);
}

if (tiltPanel) {
  tiltPanel.addEventListener("pointermove", (event) => {
    const bounds = tiltPanel.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltPanel.style.transform = `rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });

  tiltPanel.addEventListener("pointerleave", () => {
    tiltPanel.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get("name") || "Website visitor";
    const company = data.get("company") || "";
    const email = data.get("email") || "";
    const message = data.get("message") || "";
    const body = [
      `Name: ${name}`,
      `Company: ${company}`,
      `Work email: ${email}`,
      "",
      String(message)
    ].join("\n");

    window.location.href = `mailto:admin@shoppertainment.in?subject=${encodeURIComponent("Project enquiry")}&body=${encodeURIComponent(body)}`;
  });
}
