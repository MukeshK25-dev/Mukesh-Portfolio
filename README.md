# Mukesh Portfolio

Personal portfolio website for **Mukesh K**, a final-year B.Tech Information Technology student looking for Python Developer, Backend Developer and Software Engineer roles.

**Live site:** https://mukeshk25-dev.github.io/Mukesh-Portfolio/

## What's on the site
- An interactive 3D hero built with three.js. It shows the five layers of Library Management System V2 (`config`, `database`, `models`, `services`, `utils`). Drag to rotate, and click a layer to see its real files and what it does.
- A particle background, a terminal-style About section, projects, skills, education and certificates.
- 3D tilt on project cards. Motion respects the reduced-motion setting.
- A print-friendly resume page (`resume.html`) with a "Print or save as PDF" button.

Every skill and project on the page matches the resume and the public repositories on GitHub.

## Tech stack
HTML5, CSS3 and vanilla JavaScript, plus [three.js](https://threejs.org/) (r128, loaded from cdnjs). No build step.

## Run locally

```bash
git clone https://github.com/MukeshK25-dev/Mukesh-Portfolio.git
cd Mukesh-Portfolio
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Project structure

```text
Mukesh-Portfolio/
├── index.html    # Page markup
├── style.css     # Styling
├── script.js     # Typing roles, scroll reveal, card tilt, three.js scenes
├── resume.html   # Resume page
├── mukesh.jpg    # Profile photo
├── LICENSE
└── README.md
```

## License
MIT. See [LICENSE](./LICENSE).

## Author
**Mukesh K**, B.Tech Information Technology. [LinkedIn](https://www.linkedin.com/in/mukesh-kalyanasundaram-1480863b1/) · [GitHub](https://github.com/MukeshK25-dev)
