/* =========================================================
   AUSTIN GARCIA — VIDEO EDITOR PORTFOLIO
   script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  buildPortfolioGrid();
  initTimelineScrubber();
  initHeaderScrollState();
  initMobileNav();
  initFadeInObserver();
  initSkillBarAnimation();
  initParticleBackground();
  initCopyEmail();
  initBackToTop();
});

/* ---------------------------------------------------------
   PORTFOLIO GRID
   Generates 6 placeholder items. Each is ready to accept an
   embedded video later — just replace the contents of
   .portfolio-frame or swap in an <iframe>/<video> element.
   --------------------------------------------------------- */
function buildPortfolioGrid() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  // ---------------------------------------------------------
  // HOW TO ADD YOUR REAL VIDEOS
  // For each project below, fill in ONE of:
  //   videoUrl:  path/URL to a self-hosted .mp4 file
  //              e.g. 'videos/project1.mp4' (put the file in
  //              a "videos" folder next to index.html)
  //   embedUrl:  a YouTube/Vimeo EMBED link (not the normal
  //              share link)
  //              YouTube:  https://www.youtube.com/embed/VIDEO_ID
  //              Vimeo:    https://player.vimeo.com/video/VIDEO_ID
  // Leave both blank to keep showing the placeholder frame.
  // ---------------------------------------------------------
  const verticalProjects = [
    { title: 'Project 1', category: 'Simple Talking Head Edit', code: '01', videoUrl: '', embedUrl: 'https://youtube.com/embed/QWIBIQ57omo?feature=share' },
    { title: 'Project 2', category: 'Talking Head/Motion Graphics', code: '02', videoUrl: '', embedUrl: 'https://youtube.com/embed/G_WqCu0Q_fk?feature=share' },
    { title: 'Project 3', category: 'Faceless Reel', code: '03', videoUrl: '', embedUrl: 'https://youtube.com/embed/KBhHhqW-cIs?feature=share' },
    { title: 'Project 4', category: 'Typography', code: '04', videoUrl: '', embedUrl: 'https://player.vimeo.com/video/1207148523', fit: 'contain' },
    { title: 'Project 5', category: 'Uploading Soon', code: '05', videoUrl: '', embedUrl: '' },
    { title: 'Project 6', category: 'Uploading Soon', code: '06', videoUrl: '', embedUrl: '' },
  ]; 

  const featuredProjects = [
    { title: 'Project 7', category: 'Promotional Video', code: '07', videoUrl: '', embedUrl: 'https://player.vimeo.com/video/1207148256' },
    { title: 'Project 7', category: 'Short Film', code: '08', videoUrl: '', embedUrl: 'https://player.vimeo.com/video/1207147160' },
  ];

  const frag = document.createDocumentFragment();

  function createPortfolioCell(project, isWide, staggerIndex) {
    const item = document.createElement('div');
    item.className = 'portfolio-item fade-in' + (isWide ? ' portfolio-item--wide' : '');
    // Cascade each card in slightly after the last, capped so a
    // long grid doesn't end up with an awkwardly long wait.
    item.style.transitionDelay = `${Math.min(staggerIndex * 0.08, 0.4)}s`;
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `${project.title} — ${project.category}`);

    const hasVideo = Boolean(project.videoUrl);
    const hasEmbed = Boolean(project.embedUrl);

    let mediaHTML;
    if (hasVideo) {
      // Self-hosted file — shows a play button like a normal
      // embedded video. No hover autoplay: the visitor clicks
      // to play, and it plays with sound + native controls.
      const containClass = project.fit === 'contain' ? ' pf-media--contain' : '';
      mediaHTML = `
        <video class="pf-media${containClass}" src="${project.videoUrl}" playsinline preload="metadata"></video>
        <button class="pf-play pf-play--btn" type="button" aria-label="Play video">
          <svg viewBox="0 0 24 24" fill="none"><path d="M7 5l12 7-12 7V5z" fill="currentColor"/></svg>
        </button>
      `;
    } else if (hasEmbed) {
      mediaHTML = `
        <iframe class="pf-media" src="${project.embedUrl}" title="${project.title}"
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen loading="lazy"></iframe>
      `;
    } else {
      // Placeholder shown until a video/embed is provided above.
      mediaHTML = `
        <div class="pf-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M7 5l12 7-12 7V5z" fill="currentColor"/></svg>
        </div>
      `;
    }

    item.innerHTML = `
      <div class="portfolio-frame">
        ${mediaHTML}
        <div class="pf-glow" aria-hidden="true"></div>
        <span class="pf-corner pf-tl" aria-hidden="true"></span>
        <span class="pf-corner pf-tr" aria-hidden="true"></span>
        <span class="pf-corner pf-bl" aria-hidden="true"></span>
        <span class="pf-corner pf-br" aria-hidden="true"></span>

        ${!hasVideo && !hasEmbed ? `
        <div class="pf-bottom">
          <p class="pf-timecode">00:00 / 00:${15 + project.code * 3}</p>
        </div>` : ''}
      </div>
    `;

    if (hasVideo) {
      const video = item.querySelector('video.pf-media');
      const playBtn = item.querySelector('.pf-play--btn');
      if (video && playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          video.muted = false;
          video.controls = true;
          video.play();
        });
        // Re-show the button whenever playback stops (paused or ended),
        // hide it once playback actually starts.
        video.addEventListener('play', () => playBtn.classList.add('is-hidden'));
        video.addEventListener('pause', () => playBtn.classList.remove('is-hidden'));
      }
    }

    const caption = document.createElement('div');
    caption.className = 'portfolio-caption';
    caption.innerHTML = `<h3>${project.title}</h3><p>${project.category}</p>`;

    const cell = document.createElement('div');
    cell.className = 'portfolio-cell' + (isWide ? ' portfolio-cell--featured' : '');
    cell.appendChild(item);
    cell.appendChild(caption);
    return cell;
  }

  // Six 9:16 vertical clips first, in the regular grid.
  verticalProjects.forEach((project, i) => {
    frag.appendChild(createPortfolioCell(project, false, i));
  });

  // 16:9 featured clips each sit on their own full-width row
  // beneath the vertical grid, keeping the layout organized.
  featuredProjects.forEach((project, i) => {
    frag.appendChild(createPortfolioCell(project, true, verticalProjects.length + i));
  });

  grid.appendChild(frag);
}

/* ---------------------------------------------------------
   TIMELINE SCRUBBER (signature scroll-progress element)
   Mimics an NLE timeline: fill + playhead move with scroll,
   and the playhead label shows an elapsed mm:ss "read time".
   --------------------------------------------------------- */
function initTimelineScrubber() {
  const fill = document.getElementById('timelineFill');
  const playhead = document.getElementById('timelinePlayhead');
  const timeLabel = document.getElementById('playheadTime');
  const scrubber = document.querySelector('.timeline-scrubber');
  if (!fill || !playhead || !timeLabel) return;

  let scrollTimeout;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    const percent = progress * 100;

    fill.style.width = percent + '%';
    playhead.style.left = percent + '%';
    scrubber.setAttribute('aria-valuenow', Math.round(percent));

    // Fake "timecode" purely for flavor — maps progress to a
    // mm:ss readout as if scrubbing through a video timeline.
    const totalSeconds = Math.round(progress * 180); // pretend 3:00 runtime
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const ss = String(totalSeconds % 60).padStart(2, '0');
    timeLabel.textContent = `${mm}:${ss}`;

    scrubber.classList.add('is-scrolling');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => scrubber.classList.remove('is-scrolling'), 700);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ---------------------------------------------------------
   HEADER — add background once user scrolls past hero
   --------------------------------------------------------- */
function initHeaderScrollState() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------
   MOBILE NAV TOGGLE
   --------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   FADE-IN ON SCROLL (IntersectionObserver)
   --------------------------------------------------------- */
function initFadeInObserver() {
  const targets = document.querySelectorAll('.fade-in, .portfolio-item');
  if (!('IntersectionObserver' in window) || targets.length === 0) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((target) => observer.observe(target));
}

/* ---------------------------------------------------------
   SKILL BARS — animate fill width when scrolled into view
   --------------------------------------------------------- */
function initSkillBarAnimation() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (bars.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    bars.forEach((bar) => (bar.style.width = bar.dataset.level + '%'));
    return;
  }

  // NOTE: we observe .skill-bar-track (the full-width background
  // pill), not .skill-bar-fill directly. The fill starts at
  // width:0, i.e. a zero-area box — computing "40% visible" of
  // a zero-area box is unreliable and differs across browsers,
  // which is why this used to fire consistently on some devices
  // (often mobile) but not others (often desktop). The track
  // always has real width/height, so intersection is consistent
  // everywhere.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const track = entry.target;
          const bar = track.querySelector('.skill-bar-fill');
          if (bar) bar.style.width = bar.dataset.level + '%';
          observer.unobserve(track);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => observer.observe(bar.closest('.skill-bar-track') || bar));
}

/* ---------------------------------------------------------
   PARTICLE BACKGROUND (hero)
   Lightweight canvas particle field — soft floating dots
   connected by faint lines, purple/cyan palette.
   --------------------------------------------------------- */
function initParticleBackground() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = canvas.getContext('2d');
  let width, height, particles;
  const PARTICLE_COUNT = 46;
  const COLORS = ['rgba(139, 92, 246, 0.7)', 'rgba(6, 182, 212, 0.7)', 'rgba(245, 245, 247, 0.5)'];

  function resize() {
    const hero = canvas.closest('.hero');
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    // connective lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!prefersReducedMotion) {
      requestAnimationFrame(step);
    }
  }

  resize();
  createParticles();
  step();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
    if (prefersReducedMotion) step();
  });
}

/* ---------------------------------------------------------
   COPY EMAIL BUTTON
   --------------------------------------------------------- */
function initCopyEmail() {
  const btn = document.getElementById('copyEmailBtn');
  const btnText = document.getElementById('copyBtnText');
  const toast = document.getElementById('toast');
  if (!btn) return;

  const email = document.getElementById('emailText')?.textContent.trim() || '';

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast(toast, 'Email copied to clipboard');
      if (btnText) {
        const original = btnText.textContent;
        btnText.textContent = 'Copied!';
        setTimeout(() => (btnText.textContent = original), 1800);
      }
    } catch (err) {
      // Fallback for browsers without Clipboard API permission
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(toast, 'Email copied to clipboard');
    }
  });
}

function showToast(toast, message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

/* ---------------------------------------------------------
   BACK TO TOP BUTTON
   --------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  function onScroll() {
    if (window.scrollY > window.innerHeight) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
