/**
 * EvoSolutionsMzt - Interactive Card Carousels Script
 * This script initializes individual, independent carousels inside service cards.
 * It dynamically constructs the sliding track, navigation arrows, and dots from basic <img> markup.
 */

window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');

    // Opcional: una pequeña transición de opacidad
    preloader.style.opacity = '0';

    // Eliminamos el preloader del DOM cuando termine la animación
    setTimeout(function () {
        preloader.style.display = 'none';
    }, 500); // El tiempo debe coincidir con la transición del CSS
});

document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".card-carousel");

    carousels.forEach((carousel) => {
        // 1. Get all images originally placed inside the card-carousel by the user
        const originalImgs = carousel.querySelectorAll("img");
        if (originalImgs.length === 0) return; // Skip if no images are provided

        // 2. Create the carousel structure dynamically
        const container = document.createElement("div");
        container.className = "carousel-container";

        const track = document.createElement("div");
        track.className = "carousel-track";

        // Wrap each original image in a slide and append to track
        originalImgs.forEach((img) => {
            const slide = document.createElement("div");
            slide.className = "carousel-slide";

            // Clone the image to preserve attributes and styles
            const clonedImg = img.cloneNode(true);
            slide.appendChild(clonedImg);
            track.appendChild(slide);
        });

        // Clear original images from container and add the track
        carousel.innerHTML = "";
        container.appendChild(track);
        carousel.appendChild(container);

        // 3. Create Navigation Arrows
        const prevBtn = document.createElement("button");
        prevBtn.className = "carousel-btn prev";
        prevBtn.setAttribute("aria-label", "Anterior");
        prevBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        `;

        const nextBtn = document.createElement("button");
        nextBtn.className = "carousel-btn next";
        nextBtn.setAttribute("aria-label", "Siguiente");
        nextBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;

        container.appendChild(prevBtn);
        container.appendChild(nextBtn);

        // 4. Create Navigation Dots
        const dotsContainer = document.createElement("div");
        dotsContainer.className = "carousel-dots";
        carousel.appendChild(dotsContainer);

        const slidesCount = originalImgs.length;
        const dots = [];

        for (let i = 0; i < slidesCount; i++) {
            const dot = document.createElement("div");
            dot.className = `carousel-dot${i === 0 ? " active" : ""}`;
            dot.addEventListener("click", (e) => {
                e.stopPropagation();
                goToSlide(i);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
            dots.push(dot);
        }

        // Carousel State Variables
        let currentIndex = 0;
        let autoplayInterval = null;

        // Function to transition to a specific slide
        function goToSlide(index) {
            if (index < 0) {
                currentIndex = slidesCount - 1;
            } else if (index >= slidesCount) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            // Move the track smoothly using 3D transform for performance
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update active dot indicator
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });
        }

        // Navigation button listeners
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Avoid triggering card click events
            goToSlide(currentIndex - 1);
            resetAutoplay();
        });

        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Avoid triggering card click events
            goToSlide(currentIndex + 1);
            resetAutoplay();
        });

        // 5. Automatic change every 5 seconds (Autoplay)
        function startAutoplay() {
            if (autoplayInterval) return;
            autoplayInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5000);
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // Start autoplay initially
        startAutoplay();

        // 6. Pause autoplay on hover for better UX
        // We pause autoplay when the user hovers over the parent card
        const cardParent = carousel.closest(".card") || carousel;

        cardParent.addEventListener("mouseenter", () => {
            stopAutoplay();
        });

        cardParent.addEventListener("mouseleave", () => {
            startAutoplay();
        });
    });
});
