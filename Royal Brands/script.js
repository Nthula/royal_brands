document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80; // Adjust for navbar height
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".category-btn");
  const clothingSection = document.getElementById("clothing");
  const flyersSection = document.getElementById("flyers");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove 'active' from all buttons
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.getAttribute("data-category");

      if (category === "clothing") {
        clothingSection.style.display = "grid";
        flyersSection.style.display = "none";
      } else {
        clothingSection.style.display = "none";
        flyersSection.style.display = "grid";
      }
    });
  });
});

// Lightbox Elements
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");

// Open Lightbox on double click
document.querySelectorAll(".viewable").forEach(img => {
  img.addEventListener("dblclick", () => {
    lightbox.style.display = "block";
    lightboxImg.src = img.src;
  });
});

// Close Lightbox on 'X'
closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});

// Close Lightbox on click outside image
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }
});

