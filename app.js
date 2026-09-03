/* =========================================================
   ResumeAI — 3D Resume Analyzer & Job Compatibility Checker
   ========================================================= */

import Analyzer from './analyzer.js';
import ExportModule from './pdf-export.js';

const AppController = (function() {

  // ──────────────────────────────────────────────
  // 1. THREE.JS — Animated 3D Background (Lazy Loaded)
  // ──────────────────────────────────────────────
  let isThreeInitialized = false;
  function initThreeBackground() {
    if (isThreeInitialized) return;
    isThreeInitialized = true;

    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    scene.add(new THREE.AmbientLight(0x6366f1, 0.3));

    const light1 = new THREE.PointLight(0x6366f1, 1.5, 100);
    light1.position.set(10, 15, 20);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xa855f7, 1.2, 100);
    light2.position.set(-15, -10, 15);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xec4899, 0.8, 100);
    light3.position.set(0, -20, 10);
    scene.add(light3);

    const shapes = [];
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.TorusGeometry(0.8, 0.3, 8, 16),
      new THREE.DodecahedronGeometry(0.9, 0),
      new THREE.TorusKnotGeometry(0.6, 0.2, 50, 8),
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x6366f1, transparent: true, opacity: 0.25, wireframe: true }),
      new THREE.MeshPhongMaterial({ color: 0xa855f7, transparent: true, opacity: 0.2, wireframe: true }),
      new THREE.MeshPhongMaterial({ color: 0xec4899, transparent: true, opacity: 0.2, wireframe: true }),
      new THREE.MeshPhongMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.15, wireframe: true }),
    ];

    for (let i = 0; i < 35; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geo, mat);

      const scale = Math.random() * 1.8 + 0.5;
      mesh.scale.set(scale, scale, scale);
      mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30 - 10
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      shapes.push({
        mesh,
        rotSpeed: { x: (Math.random() - 0.5) * 0.008, y: (Math.random() - 0.5) * 0.008 },
        floatSpeed: Math.random() * 0.003 + 0.001,
        floatRange: Math.random() * 2 + 1,
        baseY: mesh.position.y,
      });
      scene.add(mesh);
    }

    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 600;
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 100;
      starsPos[i + 1] = (Math.random() - 0.5) * 100;
      starsPos[i + 2] = (Math.random() - 0.5) * 60 - 20;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0x8b8bff, size: 0.12, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    const linesMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.06 });
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    function updateLines() {
      while (linesGroup.children.length > 0) {
        const child = linesGroup.children[0];
        linesGroup.remove(child);
        child.geometry.dispose();
      }
      for (let i = 0; i < shapes.length; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
          const dist = shapes[i].mesh.position.distanceTo(shapes[j].mesh.position);
          if (dist < 15) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
              shapes[i].mesh.position,
              shapes[j].mesh.position,
            ]);
            const line = new THREE.Line(lineGeo, linesMat);
            linesGroup.add(line);
          }
        }
      }
    }

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let frameCount = 0;
    function animate() {
      requestAnimationFrame(animate);
      frameCount++;

      const time = performance.now() * 0.001;

      shapes.forEach((s) => {
        s.mesh.rotation.x += s.rotSpeed.x;
        s.mesh.rotation.y += s.rotSpeed.y;
        s.mesh.position.y = s.baseY + Math.sin(time * s.floatSpeed * 100) * s.floatRange;
      });

      stars.rotation.y += 0.0002;
      stars.rotation.x += 0.0001;

      camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      if (frameCount % 60 === 0) updateLines();

      light1.intensity = 1.5 + Math.sin(time * 0.5) * 0.3;
      light2.intensity = 1.2 + Math.sin(time * 0.7 + 1) * 0.3;
      light3.intensity = 0.8 + Math.sin(time * 0.9 + 2) * 0.2;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // Initialize immediately but let the main thread breathe first
  setTimeout(initThreeBackground, 100);

  // ──────────────────────────────────────────────
  // 2. CACHED DOM ELEMENTS & UI INTERACTIONS
  // ──────────────────────────────────────────────
  
  const DOM = {
    resumeText: document.getElementById('resume-text'),
    jobText: document.getElementById('job-text'),
    resumeCount: document.getElementById('resume-char-count'),
    jobCount: document.getElementById('job-char-count'),
    resumeUploadWrapper: document.getElementById('resume-upload-wrapper'),
    resumeTextWrapper: document.getElementById('resume-text-wrapper'),
    uploadZone: document.getElementById('resume-upload-zone'),
    fileInput: document.getElementById('resume-file-input'),
    fileAttachment: document.getElementById('file-attachment'),
    fileAttachmentIcon: document.getElementById('file-attachment-icon'),
    fileAttachmentName: document.getElementById('file-attachment-name'),
    fileAttachmentMeta: document.getElementById('file-attachment-meta'),
    fileRemoveBtn: document.getElementById('file-remove-btn'),
    toast: document.getElementById('toast'),
    toastMsg: document.querySelector('#toast .toast-msg'),
    toastIcon: document.querySelector('#toast .toast-icon'),
    analyzeBtn: document.getElementById('analyze-btn'),
    resultsSection: document.getElementById('results'),
    jobPanel: document.getElementById('job-panel'),
    analyzeSection: document.getElementById('analyze'),
  };

  DOM.jobText.addEventListener('input', () => {
    DOM.jobCount.textContent = DOM.jobText.value.length;
  });

  DOM.resumeText.addEventListener('input', () => {
    if (DOM.resumeCount) DOM.resumeCount.textContent = DOM.resumeText.value.length;
  });


  DOM.uploadZone.addEventListener('click', (e) => {
    if (e.target !== DOM.fileInput) {
      DOM.fileInput.click();
    }
  });
  
  // A11y keyboard support
  DOM.uploadZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      DOM.fileInput.click();
    }
  });

  DOM.uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); DOM.uploadZone.classList.add('dragover'); });
  DOM.uploadZone.addEventListener('dragleave', () => DOM.uploadZone.classList.remove('dragover'));
  DOM.uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });

  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => e.preventDefault());

  DOM.fileInput.addEventListener('change', () => {
    if (DOM.fileInput.files.length) handleFile(DOM.fileInput.files[0]);
  });

  DOM.fileRemoveBtn.addEventListener('click', () => {
    DOM.resumeText.value = '';
    DOM.fileInput.value = '';
    DOM.fileAttachment.classList.add('hidden');
    DOM.uploadZone.style.display = '';
    showToast('File removed.', 'success');
  });

  document.getElementById('start-btn').addEventListener('click', () => {
    DOM.analyzeSection.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('analyze-btn').addEventListener('click', analyzeResume);

  document.getElementById('reset-btn').addEventListener('click', () => {
    // Hide results section
    DOM.resultsSection.classList.add('hidden');
    
    // Clear text inputs
    DOM.resumeText.value = '';
    DOM.jobText.value = '';
    DOM.resumeCount.textContent = '0';
    DOM.jobCount.textContent = '0';
    
    // Reset file upload state
    DOM.fileInput.value = '';
    DOM.fileAttachment.classList.add('hidden');
    DOM.uploadZone.style.display = '';
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const analyzeTab = document.querySelector('[data-section="analyze"]');
    if (analyzeTab) analyzeTab.classList.add('active');
    
    // Scroll back to the top (input section) smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showToast('Ready for a new analysis.', 'success');
  });

  document.getElementById('export-btn').addEventListener('click', ExportModule.exportResults);

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ──────────────────────────────────────────────
  // 3. UTILITY & UI FUNCTIONS
  // ──────────────────────────────────────────────

  function showToast(message, type = 'success') {
    DOM.toast.className = `toast ${type}`;
    DOM.toastMsg.textContent = message;
    DOM.toastIcon.textContent = type === 'success' ? '✓' : '✕';

    DOM.toast.classList.add('show');
    setTimeout(() => {
      DOM.toast.classList.remove('show');
    }, 3500);
  }
  
  function showErrorModal(message, actions = []) {
    // Dynamically create a simple modal for critical feedback
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0'; overlay.style.left = '0';
    overlay.style.width = '100%'; overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.backdropFilter = 'blur(4px)';

    const modal = document.createElement('div');
    modal.className = 'glass-card';
    modal.style.maxWidth = '400px';
    modal.style.padding = '24px';
    modal.style.textAlign = 'center';
    modal.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    
    const icon = document.createElement('div');
    icon.innerHTML = '⚠️';
    icon.style.fontSize = '32px';
    icon.style.marginBottom = '16px';
    
    const text = document.createElement('p');
    text.textContent = message;
    text.style.color = 'var(--text-secondary)';
    text.style.marginBottom = '24px';
    
    const actionsDiv = document.createElement('div');
    actionsDiv.style.display = 'flex';
    actionsDiv.style.gap = '12px';
    actionsDiv.style.justifyContent = 'center';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-secondary';
    closeBtn.textContent = 'Close';
    closeBtn.onclick = () => document.body.removeChild(overlay);
    actionsDiv.appendChild(closeBtn);

    actions.forEach(act => {
      const btn = document.createElement('button');
      btn.className = 'btn-primary';
      btn.textContent = act.label;
      btn.onclick = () => {
        act.action();
        document.body.removeChild(overlay);
      };
      actionsDiv.appendChild(btn);
    });

    modal.appendChild(icon);
    modal.appendChild(text);
    modal.appendChild(actionsDiv);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function getFileTypeInfo(name) {
    const ext = name.split('.').pop().toLowerCase();
    const map = {
      pdf: { label: 'PDF', cls: 'pdf' },
      docx: { label: 'DOCX', cls: 'docx' },
      doc: { label: 'DOC', cls: 'docx' },
      txt: { label: 'TXT', cls: 'txt' },
      rtf: { label: 'RTF', cls: 'txt' },
      md: { label: 'MD', cls: 'txt' },
      html: { label: 'HTML', cls: 'txt' },
      htm: { label: 'HTML', cls: 'txt' },
      odt: { label: 'ODT', cls: 'docx' },
    };
    return map[ext] || { label: ext.toUpperCase(), cls: '' };
  }

  function showAttachmentCard(file) {
    const info = getFileTypeInfo(file.name);
    DOM.fileAttachmentName.textContent = file.name;
    DOM.fileAttachmentMeta.textContent = `${info.label} · ${formatFileSize(file.size)}`;
    DOM.fileAttachmentIcon.className = 'file-attachment-icon ' + info.cls;
    DOM.uploadZone.style.display = 'none';
    DOM.fileAttachment.classList.remove('hidden');
  }
  
  // Worker disabled due to cross-origin sub-worker restrictions
  // const parserWorker = new Worker(new URL('./parser-worker.js', import.meta.url));

  function handleFile(file) {
    const name = file.name.toLowerCase();
    const type = file.type;
    
    if (file.size > 5 * 1024 * 1024) {
      showToast('File too large (Max 5MB).', 'error');
      return;
    }

    function onResumeLoaded(message, textContent) {
      showAttachmentCard(file);
      DOM.resumeText.value = textContent;
      if (DOM.resumeCount) DOM.resumeCount.textContent = textContent.length;
      DOM.resumeTextWrapper.classList.remove('hidden');

      if (DOM.jobText.value.trim().length > 20) {
        showToast(`${message} Running analysis…`, 'success');
        setTimeout(() => analyzeResume(), 600);
      } else {
        showToast(`${message} Now add a job description.`, 'success');
        DOM.jobPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        DOM.jobPanel.classList.add('glass-card-highlight');
        DOM.jobText.focus();
        setTimeout(() => {
          DOM.jobPanel.classList.remove('glass-card-highlight');
        }, 3000);
      }
    }

    // --- PDF & DOCX ---
    if (name.endsWith('.pdf') || type === 'application/pdf' || 
        name.endsWith('.docx') || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      
      showToast(`Analyzing ${name.endsWith('.pdf') ? 'PDF' : 'DOCX'}.`, 'success');
      
      const processFile = async () => {
        try {
          let text = '';
          if (name.endsWith('.pdf') || type === 'application/pdf') {
            text = await parsePDF(file);
          } else {
            text = await parseDOCX(file);
          }
          onResumeLoaded('File loaded successfully.', text);
        } catch (error) {
          console.error('Parsing Error:', error);
          if (error.name === 'PDFTextExtractionError') {
            showErrorModal(`This PDF appears to be image-based. Text extraction failed.`, [
              { label: 'Paste text manually', action: () => document.getElementById('resume-text').focus() }
            ]);
          } else {
            showErrorModal(`Could not read the file (Error: ${error.message}). Please try another format or paste text directly.`, [
              { label: 'Paste text manually', action: () => document.getElementById('resume-text').focus() }
            ]);
          }
        }
      };
      
      processFile();
      return;
    }

    // --- HTML files (strip tags) ---
    if (name.endsWith('.html') || name.endsWith('.htm') || type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(e.target.result, 'text/html');
        const text = doc.body.textContent || doc.body.innerText || '';
        onResumeLoaded('HTML file loaded.', text.trim());
      };
      reader.readAsText(file);
      return;
    }

    // --- DOC files ---
    if (name.endsWith('.doc') || type === 'application/msword') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(e.target.result));
          const readable = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
                               .replace(/\s{3,}/g, '\n')
                               .trim();
          if (readable.length < 20) {
            showErrorModal('Could not extract text from .doc — please save as .docx or paste text.', [
              { label: 'Paste text manually', action: () => document.getElementById('resume-text').focus() }
            ]);
            return;
          }
          onResumeLoaded('.DOC loaded (best-effort).', readable);
        } catch {
          showToast('Could not read .doc file. Please save as .docx or paste text.', 'error');
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    // --- All other text-based formats ---
    const reader = new FileReader();
    reader.onload = (e) => {
      let text = e.target.result;
      if (name.endsWith('.rtf') || text.startsWith('{\\rtf')) {
        text = text.replace(/\{\\[^}]*\}/g, '')
                   .replace(/\\[a-z]+\d*\s?/gi, '')
                   .replace(/[{}]/g, '')
                   .trim();
      }
      const ext = name.split('.').pop().toUpperCase();
      onResumeLoaded(`${ext} file loaded.`, text);
    };
    reader.onerror = () => {
      showToast('Could not read file. Please paste your resume text directly.', 'error');
    };
    reader.readAsText(file);
  }

  // ──────────────────────────────────────────────
  // 4. ANALYSIS & RENDERING
  // ──────────────────────────────────────────────

  function analyzeResume() {
    const resume = DOM.resumeText.value.trim();
    const job = DOM.jobText.value.trim();

    if (!resume) {
      showToast('Please attach your resume file.', 'error');
      DOM.uploadZone.classList.add('glass-card-highlight');
      setTimeout(() => {
        DOM.uploadZone.classList.remove('glass-card-highlight');
      }, 3000);
      return;
    }

    if (!job) {
      showToast('Please enter the job description.', 'error');
      DOM.jobText.focus();
      return;
    }

    if (resume.length < 50) {
      showToast('The attached resume seems too short or could not be read properly.', 'error');
      return;
    }

    if (job.length < 30) {
      showToast('Job description seems too short. Please add more detail.', 'error');
      return;
    }

    DOM.analyzeBtn.classList.add('loading');
    DOM.analyzeBtn.disabled = true;

    setTimeout(() => {
      const results = Analyzer.performAnalysis(resume, job);
      renderResults(results);
      DOM.analyzeBtn.classList.remove('loading');
      DOM.analyzeBtn.disabled = false;
      showToast('Analysis complete!', 'success');
      
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) {
        // Silently fail if audio context is restricted
      }
    }, 800);
  }

  function renderResults(data) {
    DOM.resultsSection.classList.remove('hidden');

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const resultsTab = document.querySelector('[data-section="results"]');
    if (resultsTab) {
      resultsTab.classList.add('active');
    }

    setTimeout(() => {
      DOM.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const scoreRingSVG = document.querySelector('.score-ring');
    if (!scoreRingSVG.querySelector('defs')) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.id = 'scoreGradient';
      gradient.setAttribute('x1', '0%'); gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '100%'); gradient.setAttribute('y2', '100%');

      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', '#6366f1');
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '50%'); stop2.setAttribute('stop-color', '#a855f7');
      const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop3.setAttribute('offset', '100%'); stop3.setAttribute('stop-color', '#ec4899');

      gradient.append(stop1, stop2, stop3);
      defs.append(gradient);
      scoreRingSVG.prepend(defs);
    }

    const circumference = 2 * Math.PI * 85;
    const scoreFill = document.getElementById('score-ring-fill');
    scoreFill.style.strokeDasharray = circumference;
    scoreFill.style.strokeDashoffset = circumference;
    setTimeout(() => {
      const offset = circumference - (data.overallScore / 100) * circumference;
      scoreFill.style.strokeDashoffset = offset;
    }, 200);

    animateCounter('score-number', data.overallScore, 2000);

    document.getElementById('score-title').textContent = Analyzer.getScoreTitle(data.overallScore);
    document.getElementById('score-description').textContent = Analyzer.getScoreDescription(data);

    const badgesContainer = document.getElementById('score-badges');
    badgesContainer.innerHTML = '';
    const badges = Analyzer.getScoreBadges(data);
    badges.forEach(b => {
      const badge = document.createElement('span');
      badge.className = `score-badge ${b.class}`;
      badge.textContent = b.text;
      badgesContainer.appendChild(badge);
    });

    setTimeout(() => {
      animateMetric('skill-match-value', 'skill-bar', data.skillScore);
      const allMatched = Array.from(new Set([...data.matchedSkills, ...data.matchedATSKeywords]));
      const allMissing = Array.from(new Set([...data.missingSkills, ...data.missingATSKeywords]));
      document.getElementById('skill-details').textContent =
        `${allMatched.length} of ${allMatched.length + allMissing.length} required skills & keywords matched`;
    }, 300);

    setTimeout(() => {
      animateMetric('exp-match-value', 'exp-bar', data.expScore);
      document.getElementById('exp-details').textContent =
        data.resumeYears > 0 && data.jobYears > 0
          ? `Your ${data.resumeYears} years vs required ${data.jobYears}+ years`
          : data.resumeYears > 0
            ? `${data.resumeYears} years of experience detected`
            : 'Experience years could not be determined';
    }, 500);

    setTimeout(() => {
      animateMetric('edu-match-value', 'edu-bar', data.eduScore);
      document.getElementById('edu-details').textContent =
        `Education and certification keyword alignment`;
    }, 700);

    setTimeout(() => {
      animateMetric('key-match-value', 'key-bar', data.keywordScore);
      document.getElementById('key-details').textContent =
        `ATS keyword optimization score`;
    }, 900);

    const matchedContainer = document.getElementById('matched-skills');
    const missingContainer = document.getElementById('missing-skills');
    matchedContainer.innerHTML = '';
    missingContainer.innerHTML = '';

    const allMatchedList = Array.from(new Set([...data.matchedSkills, ...data.matchedATSKeywords]));
    const allMissingList = Array.from(new Set([...data.missingSkills, ...data.missingATSKeywords]));

    allMatchedList.forEach((s, i) => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag matched';
      tag.textContent = s;
      tag.style.animationDelay = `${i * 0.05}s`;
      matchedContainer.appendChild(tag);
    });

    if (allMatchedList.length === 0) {
      matchedContainer.innerHTML = '<span style="color:var(--text-tertiary);font-size:0.85rem;">No matching skills found</span>';
    }

    allMissingList.forEach((s, i) => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag missing';
      tag.textContent = s;
      tag.style.animationDelay = `${i * 0.05}s`;
      missingContainer.appendChild(tag);
    });

    if (data.missingSkills.length === 0) {
      missingContainer.innerHTML = '<span style="color:var(--text-tertiary);font-size:0.85rem;">No missing skills — great match!</span>';
    }

    const recList = document.getElementById('rec-list');
    recList.innerHTML = '';
    data.recommendations.forEach((rec, i) => {
      const item = document.createElement('div');
      item.className = 'rec-item';
      item.style.animationDelay = `${0.7 + i * 0.1}s`;
      item.innerHTML = `
        <div class="rec-priority priority-${rec.priority}">
          ${rec.priority === 'high' ? '!' : rec.priority === 'medium' ? '~' : '✓'}
        </div>
        <div class="rec-content">
          <h4>${rec.title}</h4>
          <p>${rec.description}</p>
        </div>
      `;
      recList.appendChild(item);
    });
  }

  function animateCounter(elementId, target, duration) {
    const el = document.getElementById(elementId);
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function animateMetric(valueId, barId, score) {
    const valueEl = document.getElementById(valueId);
    const barEl = document.getElementById(barId);

    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / 1500, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      valueEl.textContent = Math.round(score * eased) + '%';
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);

    setTimeout(() => {
      barEl.style.width = score + '%';
    }, 100);
  }

  // Export public API
  return { showToast };

})();

// --- PDF & DOCX Parsing Functions ---

// Configure pdf.js worker
if (typeof window !== 'undefined' && window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);
  
  const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n\n';
  }
  
  fullText = fullText.trim();
  
  if (fullText.length < 10) {
    const error = new Error('PDF appears to be image-based. Text extraction failed.');
    error.name = 'PDFTextExtractionError';
    throw error;
  }
  
  return fullText;
}

async function parseDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value.trim();
  
  if (text.length < 10) {
    const error = new Error('DOCX appears empty. Text extraction failed.');
    error.name = 'DOCXTextExtractionError';
    throw error;
  }
  
  return text;
}

export { AppController as default };
