const roles = [
    "Software Engineer",
    "Python Backend Developer",
    "FastAPI Developer",
    "Open Source Learner",
    "Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingElement = document.getElementById("typing-text");

function typeEffect() {

    const currentRole = roles[roleIndex];

    if (!isDeleting) {

        typingElement.textContent =
            currentRole.substring(0, charIndex + 1);

        charIndex++;

        if (charIndex === currentRole.length) {

            isDeleting = true;

            setTimeout(typeEffect, 1800);

            return;
        }

    } else {

        typingElement.textContent =
            currentRole.substring(0, charIndex - 1);

        charIndex--;

        if (charIndex === 0) {

            isDeleting = false;

            roleIndex++;

            if (roleIndex >= roles.length) {
                roleIndex = 0;
            }
        }
    }

    setTimeout(typeEffect, isDeleting ? 60 : 110);
}

typeEffect();

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");
            }

        });

    },
    {
        threshold: 0.15
    }
);

document.querySelectorAll(".section").forEach((section) => {

    section.classList.add("hidden-section");

    observer.observe(section);

});

window.addEventListener("scroll", () => {

    const header = document.querySelector(".header");

    if (window.scrollY > 50) {

        header.style.boxShadow =
            "0 8px 25px rgba(0,0,0,0.35)";

    } else {

        header.style.boxShadow = "none";
    }

});

const navLinks =
    document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    document.querySelectorAll("section").forEach((section) => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");
        }

    });

    navLinks.forEach((link) => {

        link.classList.remove("active-link");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {

            link.classList.add("active-link");
        }

    });

});

document.querySelectorAll(".project-card")
.forEach((card) => {

    card.addEventListener("mouseenter", () => {

        card.style.transform =
            "translateY(-12px)";
    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "translateY(0)";
    });

});

document.querySelectorAll(".skill-card")
.forEach((card) => {

    card.addEventListener("mouseenter", () => {

        card.style.transform =
            "translateY(-8px)";
    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "translateY(0)";
    });

});

console.log(
    "Mukesh Portfolio Loaded Successfully 🚀"
);

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll("section").forEach(section=>{
    section.classList.add("fade-in");
    observer.observe(section);
});