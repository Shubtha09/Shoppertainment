const header = document.querySelector("[data-header]");
const menuPanel = document.querySelector("[data-menu-panel]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");
const stepsGrid = document.querySelector(".steps-grid");
const revealTargets = document.querySelectorAll(
  ".hero-copy > *, .statement-strip, .section-label, h2, .story-grid p, .bucket, .work-controls, .w-card, .why-grid article, .steps-grid article, .mini-grid article, .trust-stats article, .brand-showcase, .testimonial-grid blockquote, .contact-actions > *"
);
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

const workGrid = document.querySelector("[data-work-grid]");

if (workGrid) {
  const cards = Array.from(workGrid.querySelectorAll(".w-card"));
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const tagButtons = Array.from(workGrid.querySelectorAll(".w-tag"));
  const activeTagChip = document.querySelector("[data-active-tag]");
  const activeTagLabel = document.querySelector("[data-active-tag-label]");
  const workCount = document.querySelector("[data-work-count]");
  const emptyState = document.querySelector("[data-work-empty]");
  const tagsOf = (card) => card.dataset.tags.split(",");

  let activePractice = "all";
  let activeTag = "";

  filterButtons.forEach((button) => {
    const value = button.dataset.filter;
    const total = value === "all" ? cards.length : cards.filter((card) => card.dataset.practice === value).length;
    const counter = button.querySelector("b");
    if (counter) counter.textContent = String(total);
  });

  const applyFilter = () => {
    let shown = 0;

    cards.forEach((card) => {
      const matchesPractice = activePractice === "all" || card.dataset.practice === activePractice;
      const matchesTag = !activeTag || tagsOf(card).includes(activeTag);
      const isVisible = matchesPractice && matchesTag;
      card.hidden = !isVisible;
      if (isVisible) shown += 1;
    });

    filterButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === activePractice));
    });

    tagButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tag === activeTag);
    });

    if (activeTagChip) {
      activeTagChip.hidden = !activeTag;
      if (activeTag && activeTagLabel) {
        const source = tagButtons.find((button) => button.dataset.tag === activeTag);
        activeTagLabel.textContent = source ? source.textContent : activeTag;
      }
    }

    if (workCount) {
      workCount.textContent = shown === cards.length ? `Selected · ${cards.length} of 250+` : `${shown} of ${cards.length} shown`;
    }

    if (emptyState) emptyState.hidden = shown > 0;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activePractice = button.dataset.filter;
      applyFilter();
    });
  });

  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeTag = activeTag === button.dataset.tag ? "" : button.dataset.tag;
      applyFilter();
    });
  });

  const clearTag = document.querySelector("[data-clear-tag]");
  if (clearTag) {
    clearTag.addEventListener("click", () => {
      activeTag = "";
      applyFilter();
    });
  }

  document.querySelectorAll("[data-practice-link]").forEach((link) => {
    link.addEventListener("click", () => {
      activePractice = link.dataset.practiceLink;
      activeTag = "";
      applyFilter();
    });
  });

  const resetFilters = document.querySelector("[data-reset-filters]");
  if (resetFilters) {
    resetFilters.addEventListener("click", () => {
      activePractice = "all";
      activeTag = "";
      applyFilter();
    });
  }

  applyFilter();
}

if (stepsGrid) {
  const stepsObserver = new IntersectionObserver(
    ([entry]) => {
      stepsGrid.classList.toggle("is-connected", entry.isIntersecting);
    },
    { threshold: 0.5 }
  );

  stepsObserver.observe(stepsGrid);
}
