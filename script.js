"use strict";
document.documentElement.classList.add("js");

const toggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const closeMenu = () => {
  toggle.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
};
toggle.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toggle.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
window.matchMedia("(min-width: 1101px)").addEventListener("change", closeMenu);

const galleryItems = [...document.querySelectorAll("[data-gallery]")];
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
const lightboxCounter = lightbox.querySelector(".lightbox-counter");
let currentImage = 0;
let galleryTrigger;

function showImage(index) {
  currentImage = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentImage];
  lightboxImage.src = item.dataset.gallery;
  lightboxImage.alt = item.querySelector("img").alt;
  lightboxCaption.textContent = item.dataset.caption;
  lightboxCounter.textContent = `${currentImage + 1} / ${galleryItems.length}`;
}
function closeLightbox() {
  lightbox.close();
}
galleryItems.forEach((item, index) =>
  item.addEventListener("click", () => {
    if (typeof lightbox.showModal !== "function") {
      window.open(item.dataset.gallery, "_blank", "noopener");
      return;
    }
    galleryTrigger = item;
    showImage(index);
    lightbox.showModal();
    document.body.classList.add("modal-open");
  }),
);
lightbox
  .querySelector(".lightbox-close")
  .addEventListener("click", closeLightbox);
lightbox
  .querySelector(".lightbox-prev")
  .addEventListener("click", () => showImage(currentImage - 1));
lightbox
  .querySelector(".lightbox-next")
  .addEventListener("click", () => showImage(currentImage + 1));
lightbox.addEventListener("click", (event) => {
  if (
    event.target === lightbox ||
    event.target === lightbox.querySelector(".lightbox-content")
  )
    closeLightbox();
});
lightbox.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  galleryTrigger?.focus();
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    showImage(currentImage + (event.key === "ArrowRight" ? 1 : -1));
  }
});

// Highlight only the weekday, not an unverified live open/closed status.
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function updateCalendarDetails() {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Bratislava",
    weekday: "short",
  }).format(now);
  const currentDay = days.indexOf(weekday);
  document.querySelectorAll("[data-day]").forEach((row) => {
    row.classList.toggle("is-today", Number(row.dataset.day) === currentDay);
  });
  const yearElement = document.querySelector("[data-year]");
  if (yearElement) {
    yearElement.textContent = new Intl.DateTimeFormat("sk-SK", {
      timeZone: "Europe/Bratislava",
      year: "numeric",
    }).format(now);
  }
}

updateCalendarDetails();
window.addEventListener("pageshow", updateCalendarDetails);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") updateCalendarDetails();
});
