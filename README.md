# Resume Match AI

Resume Match AI is an intelligent, client-side web application designed to evaluate a candidate's resume against a specific job description. It simulates the behavior of Applicant Tracking Systems (ATS) to provide actionable feedback, compatibility scores, and personalized recommendations, empowering job seekers to optimize their resumes.

## 🚀 Features

- **Client-Side Processing**: All analysis happens entirely in the browser using Web Workers. No resumes or job descriptions are sent to any server, ensuring complete data privacy.
- **PII Redaction**: Automatically detects and strips Personal Identifiable Information (Emails, Phone Numbers, URLs) before analysis.
- **Multi-Input Support**: Users can either type/paste their resume text manually or upload a PDF document for automatic parsing (powered by PDF.js).
- **Advanced Scoring Engine**: 
  - **Overall Score**: Weighted average of Skills (40%), Experience (25%), ATS Keywords (20%), and Education (15%).
  - **Fuzzy ATS Keyword Matching**: Accounts for variations in word endings (e.g., -s, -ed, -ing).
  - **Strict Binary Matching**: Prevents keyword stuffing by ensuring a single repeated keyword doesn't artificially inflate the score.
- **Categorized Analytics**: Breaks down matched/missing skills into categories (Frameworks, Databases, Tools, etc.) for easy visualization.
- **Dynamic 3D UI**: Features a sleek, responsive interface with a WebGL (Three.js) particle background and interactive charts.
- **PDF Export**: Generates a clean, downloadable PDF report of the analysis results (using html2pdf.js).

## 🛠️ Technology Stack

- **Frontend Core**: HTML5, CSS3, Vanilla JavaScript (ES6+). No heavy frameworks like React or Vue.
- **PDF Parsing**: [PDF.js](https://mozilla.github.io/pdf.js/) runs in a dedicated Web Worker to extract text from uploaded files without freezing the UI.
- **PDF Generation**: [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) converts the HTML result cards into a downloadable PDF report.
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) renders the circular progress charts for scoring.
- **Background Animations**: [Three.js](https://threejs.org/) powers the interactive 3D particle background (lazy-loaded for performance).

## 🏗️ Project Architecture

- **`index.html`**: The structure of the application, including the dual-input UI and the hidden results template.
- **`index.css`**: All styling, including glassmorphism effects, flexbox layouts, animations, and the UI design system.
- **`app.js`**: The main DOM controller. Handles event listeners, UI state transitions, file uploads, canvas rendering, and triggers the Web Worker.
- **`analyzer.js`**: The core algorithmic engine. Contains logic for tokenizing text, applying weights, detecting seniority/experience gaps, scoring ATS keywords, and generating dynamic recommendations.
- **`data.js`**: The central knowledge base containing RegEx patterns for hundreds of skills, action verbs, job roles, ATS keywords, and synonyms.
- **`parser-worker.js`**: A background Web Worker that safely imports PDF.js to extract raw text from binary PDF uploads.
- **`pdf-export.js`**: Encapsulates the logic for selecting the DOM result elements and generating the final PDF.

## 🚀 Getting Started / Deployment

Since the application has zero backend dependencies, it can be hosted on any static file server.

1. **Local Development**:
   - Clone the repository.
   - Run any local HTTP server (e.g., `python -m http.server 8080` or `npx serve`).
   - Open `http://localhost:8080` in your browser.

2. **Production Deployment**:
   - Easily deployable via **Vercel**, **GitHub Pages**, or **Netlify**.
   - Connected via GitHub CI/CD, the app automatically redeploys upon pushing to the `main` branch.

## 📝 Recent System Updates
- Implemented robust PII redaction algorithms.
- Optimized 3D background startup times via asynchronous initialization.
- Re-engineered the UI flow to allow instant reset ("New Analysis") without full page reloads.
- Stabilized ATS scoring against keyword frequency manipulation.