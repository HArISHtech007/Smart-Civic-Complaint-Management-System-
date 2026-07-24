function renderModal({ id, title, content, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, variant = 'default', size = 'md' }) {
  const sizes = { sm: '400px', md: '520px', lg: '640px', xl: '800px' };
  const overlay = document.createElement('div');
  overlay.id = id || 'modal-' + Date.now();
  overlay.style.cssText = 'position: fixed; inset: 0; z-index: 9000; display: flex; align-items: center; justify-content: center; animation: modalBackdrop 0.3s ease forwards;';
  overlay.innerHTML = `
    <div class="modal-backdrop" style="position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);"></div>
    <div class="modal-content" style="position: relative; width: ${sizes[size] || sizes.md}; max-width: 90vw; max-height: 90vh; background: var(--bg-card); border: 1px solid var(--border-default); border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); overflow: hidden; animation: modalIn 0.3s ease forwards;">
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border-subtle);">
        <h3 style="font-size: var(--text-lg); font-weight: 700;">${title}</h3>
        <button class="modal-close" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: var(--text-tertiary); hover:background:rgba(148,163,184,0.1);" onclick="this.closest('#${overlay.id}').remove()">
          <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
        </button>
      </div>
      <div style="padding: 24px; overflow-y: auto; max-height: calc(90vh - 140px);">${content}</div>
      <div style="display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-subtle);">
        <button class="btn btn-secondary modal-cancel">${cancelText}</button>
        <button class="btn btn-${variant === 'danger' ? 'danger' : 'primary'} modal-confirm">${confirmText}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.querySelector('.modal-backdrop').addEventListener('click', close);
  overlay.querySelector('.modal-cancel').addEventListener('click', () => { if (onCancel) onCancel(); close(); });
  overlay.querySelector('.modal-confirm').addEventListener('click', () => { if (onConfirm) onConfirm(close); else close(); });
  return overlay;
}

function showConfirmDialog(message, onConfirm) {
  return renderModal({
    title: 'Confirm Action',
    content: `<p style="color: var(--text-secondary);">${message}</p>`,
    confirmText: 'Yes, Proceed',
    variant: 'danger',
    onConfirm: (close) => { onConfirm(); close(); }
  });
}