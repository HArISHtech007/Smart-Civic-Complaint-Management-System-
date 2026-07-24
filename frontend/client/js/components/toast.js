class Toast {
  constructor() {
    this.container = document.createElement('div');
    this.container.style.cssText = 'position: fixed; top: 16px; right: 16px; z-index: 10000; display: flex; flex-direction: column; gap: 8px; pointer-events: none;';
    document.body.appendChild(this.container);
  }
  show(message, type = 'info', duration = 4000) {
    const colors = {
      success: { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)', icon: 'check_circle' },
      error: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', icon: 'error' },
      warning: { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', icon: 'warning' },
      info: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', icon: 'info' }
    };
    const cfg = colors[type] || colors.info;
    const el = document.createElement('div');
    el.style.cssText = `background: ${cfg.bg}; backdrop-filter: blur(12px); border: 1px solid ${cfg.border}; border-radius: 12px; padding: 12px 20px; display: flex; align-items: center; gap: 10px; pointer-events: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.5); animation: toastIn 0.4s ease forwards; min-width: 300px;`;
    el.innerHTML = `<span class="material-symbols-outlined" style="font-size: 20px; color: ${cfg.border}">${cfg.icon}</span><span style="font-size: 14px; color: var(--text-primary); flex: 1;">${message}</span><span class="material-symbols-outlined" style="font-size: 16px; cursor: pointer; color: var(--text-tertiary);" onclick="this.parentElement.style.animation='toastOut 0.3s ease forwards';setTimeout(()=>this.parentElement.remove(),300)">close</span>`;
    this.container.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }
  success(msg, dur) { this.show(msg, 'success', dur); }
  error(msg, dur) { this.show(msg, 'error', dur); }
  warning(msg, dur) { this.show(msg, 'warning', dur); }
  info(msg, dur) { this.show(msg, 'info', dur); }
}

const toast = new Toast();
