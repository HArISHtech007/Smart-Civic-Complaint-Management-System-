function getStatsCounter() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = parseInt(el.dataset.duration) || 2000;
        let current = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current.toLocaleString() + suffix;
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-counter').forEach(el => observer.observe(el));
}

function observeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

function createLoadingSkeleton(count = 3, type = 'card') {
  let html = '';
  for (let i = 0; i < count; i++) {
    if (type === 'card') {
      html += `<div class="card p-lg animate-fade-in-up stagger-${i + 1}" style="animation-delay: ${i * 0.1}s">
        <div class="skeleton" style="height: 180px; margin-bottom: var(--space-md)"></div>
        <div class="skeleton" style="height: 20px; width: 60%; margin-bottom: var(--space-sm)"></div>
        <div class="skeleton" style="height: 16px; width: 40%;"></div>
      </div>`;
    } else if (type === 'row') {
      html += `<div class="flex items-center gap-md p-md" style="border-bottom: 1px solid var(--border-subtle)">
        <div class="skeleton" style="width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;"></div>
        <div style="flex: 1">
          <div class="skeleton" style="height: 16px; width: 40%; margin-bottom: var(--space-xs)"></div>
          <div class="skeleton" style="height: 12px; width: 60%;"></div>
        </div>
      </div>`;
    }
  }
  return html;
}

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, limit = 100) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}