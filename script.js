import { YT_API_KEY } from "./config.js";
gsap.registerPlugin(ScrollTrigger);

// ===== HERO ANIMATIONS =====
window.addEventListener("DOMContentLoaded", () => {
  const heroBg = document.querySelector(".hero-bg");

  // Parallax motion
  document.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX / window.innerWidth - 0.5) * 10;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 10;
    gsap.to(heroBg, {
      x: moveX,
      y: moveY,
      scale: 1.07,
      duration: 2,
      ease: "power2.out",
    });
  });

  // GSAP entry animation
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".profile-wrapper", { opacity: 0, y: 40, duration: 1.2 })
    .from(".name", { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
    .from(".tagline", { opacity: 0, y: 10, duration: 0.8 }, "-=0.4")
    .from(".explore-btn", { opacity: 0, scale: 0.9, duration: 0.8, ease: "back.out(1.7)" }, "-=0.3");

  // Smooth scroll for Explore button
  document.getElementById("scrollBtn").addEventListener("click", () => {
    document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
  });

  // Smooth scroll for header links
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
  
      if (href.startsWith("#")) {
        e.preventDefault(); // only prevent default for section scrolls
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });  
});

// ===== FILM CARD (Hover Trailer + Reflection) =====
const filmCard = document.getElementById("filmCard");
const trailer = document.querySelector(".film-trailer");
const poster = document.querySelector(".film-poster");
const reflection = document.querySelector(".reflection");

filmCard.addEventListener("mouseenter", () => {
  trailer.currentTime = 0;
  trailer.play();
  gsap.to(trailer, { opacity: 1, duration: 0.8 });
  gsap.to(poster, { opacity: 0, duration: 0.8 });
  reflection.style.opacity = 1;
});

filmCard.addEventListener("mouseleave", () => {
  trailer.pause();
  gsap.to(trailer, { opacity: 0, duration: 0.8 });
  gsap.to(poster, { opacity: 1, duration: 0.8 });
  reflection.style.opacity = 0;
});

// ===== YouTube Live Views =====
async function getYouTubeViews(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${YT_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const views = Number(data.items[0].statistics.viewCount);
      const counter = { val: 0 };

      gsap.to(counter, {
        val: views,
        duration: 2.5,
        ease: "power3.out",
        onUpdate: () => {
          document.getElementById("viewsCount").textContent = Math.floor(counter.val).toLocaleString();
        },
      });
    } else {
      document.getElementById("viewsCount").textContent = "N/A";
    }
  } catch (err) {
    console.error("Failed to fetch YouTube views:", err);
    document.getElementById("viewsCount").textContent = "N/A";
  }
}

ScrollTrigger.create({
  trigger: ".film-section",
  start: "top 80%",
  once: true,
  onEnter: () => getYouTubeViews("c70oFsvDDyM"),
});

// ===== AUTO-SCROLL DESIGN GALLERY =====
const galleryWrapper = document.querySelector(".design-gallery-wrapper");
const gallery = document.querySelector(".design-gallery");
const scrollLine = document.querySelector(".scroll-line");
const leftBtn = document.querySelector(".scroll-btn.left");
const rightBtn = document.querySelector(".scroll-btn.right");

let autoScrollSpeed = 1;
let autoScrollActive = true;
let userInteracting = false;
let resumeTimeout;

// Auto scroll logic
function autoScroll() {
  if (autoScrollActive && !userInteracting) {
    galleryWrapper.scrollLeft += autoScrollSpeed;
    if (galleryWrapper.scrollLeft >= gallery.scrollWidth - galleryWrapper.clientWidth) {
      galleryWrapper.scrollLeft = 0;
    }
  }

  const scrollPercent =
    (galleryWrapper.scrollLeft / (gallery.scrollWidth - galleryWrapper.clientWidth)) * 100;
  scrollLine.style.width = `${scrollPercent}%`;

  requestAnimationFrame(autoScroll);
}

// Pause when user interacts
function pauseAutoScroll() {
  userInteracting = true;
  clearTimeout(resumeTimeout);
  resumeTimeout = setTimeout(() => (userInteracting = false), 3000);
}

// Buttons
leftBtn.addEventListener("click", () => {
  pauseAutoScroll();
  galleryWrapper.scrollBy({ left: -400, behavior: "smooth" });
});

rightBtn.addEventListener("click", () => {
  pauseAutoScroll();
  galleryWrapper.scrollBy({ left: 400, behavior: "smooth" });
});

// User scroll
galleryWrapper.addEventListener("wheel", pauseAutoScroll);
galleryWrapper.addEventListener("mousedown", pauseAutoScroll);
galleryWrapper.addEventListener("touchstart", pauseAutoScroll);

autoScroll();
