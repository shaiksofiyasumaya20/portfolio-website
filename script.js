const container = document.querySelector(".snap-container");
const sections = [...document.querySelectorAll(".panel")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const dots = [...document.querySelectorAll(".dot")];
const glow = document.querySelector(".cursor-glow");

let activeIndex = 0;
let isAnimating = false;
let touchStartY = 0;

function setActive(index) {
  activeIndex = Math.max(0, Math.min(index, sections.length - 1));
  const activeId = sections[activeIndex].id;

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });

  dots.forEach((dot) => {
    dot.classList.toggle("active", dot.getAttribute("href") === `#${activeId}`);
  });
}

function goToSection(index) {
  const nextIndex = Math.max(0, Math.min(index, sections.length - 1));

  if (nextIndex === activeIndex || isAnimating) {
    return;
  }

  isAnimating = true;
  setActive(nextIndex);
  sections[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    isAnimating = false;
  }, 850);
}

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    setActive(sections.indexOf(visible.target));
  },
  {
    root: container,
    threshold: [0.55, 0.75],
  }
);

sections.forEach((section) => observer.observe(section));

container.addEventListener(
  "wheel",
  (event) => {
    if (Math.abs(event.deltaY) < 24) {
      return;
    }

    event.preventDefault();
    goToSection(activeIndex + (event.deltaY > 0 ? 1 : -1));
  },
  { passive: false }
);

container.addEventListener(
  "touchstart",
  (event) => {
    touchStartY = event.touches[0].clientY;
  },
  { passive: true }
);

container.addEventListener(
  "touchend",
  (event) => {
    const touchEndY = event.changedTouches[0].clientY;
    const distance = touchStartY - touchEndY;

    if (Math.abs(distance) > 56) {
      goToSection(activeIndex + (distance > 0 ? 1 : -1));
    }
  },
  { passive: true }
);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    goToSection(sections.indexOf(target));
  });
});

window.addEventListener("mousemove", (event) => {
  glow.style.setProperty("--x", `${event.clientX}px`);
  glow.style.setProperty("--y", `${event.clientY}px`);
});
