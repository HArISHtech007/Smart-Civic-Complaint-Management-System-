function getSidebarComplaintStats() {
  try {
    const list = JSON.parse(localStorage.getItem('civic_user_complaints') || '[]');
    const total = list.length;
    const resolved = list.filter(c => ['resolved', 'closed', 'completed'].includes((c.status || '').toLowerCase())).length;
    const pending = Math.max(0, total - resolved);
    return { total, pending, resolved };
  } catch (e) {
    return { total: 0, pending: 0, resolved: 0 };
  }
}

function renderSidebar(activePage) {
  const role = getRole();
  const stats = getSidebarComplaintStats();

  const menus = {
    citizen: [
      { icon: 'dashboard', label: 'Dashboard', href: '/citizen/dashboard.html', id: 'dashboard' },
      { icon: 'add_circle', label: 'Report Issue', href: '/citizen/submit.html', id: 'submit' },
      { icon: 'list_alt', label: 'My Complaints', href: '/citizen/track.html', id: 'track', hasStats: true },
      { icon: 'notifications', label: 'Notifications', href: '/citizen/notifications.html', id: 'notifications' }
    ],
    officer: [
      { icon: 'dashboard', label: 'Dashboard', href: '/officer/dashboard.html', id: 'dashboard' },
      { icon: 'list_alt', label: 'Complaints', href: '/officer/complaints.html', id: 'complaints', hasStats: true },
      { icon: 'map', label: 'Map View', href: '/officer/map.html', id: 'map' }
    ],
    head_officer: [
      { icon: 'dashboard', label: 'Dashboard', href: '/head-officer/dashboard.html', id: 'dashboard' },
      { icon: 'people', label: 'Officers', href: '/head-officer/officers.html', id: 'officers' },
      { icon: 'list_alt', label: 'Complaints', href: '/head-officer/complaints.html', id: 'complaints', hasStats: true },
      { icon: 'analytics', label: 'Analytics', href: '/head-officer/analytics.html', id: 'analytics' }
    ],
    admin: [
      { icon: 'dashboard', label: 'Dashboard', href: '/admin/dashboard.html', id: 'dashboard' },
      { icon: 'list_alt', label: 'Complaints', href: '/admin/complaints.html', id: 'complaints', hasStats: true },
      { icon: 'people', label: 'Users', href: '/admin/users.html', id: 'users' },
      { icon: 'apartment', label: 'Departments', href: '/admin/departments.html', id: 'departments' },
      { icon: 'analytics', label: 'Analytics', href: '/admin/analytics.html', id: 'analytics' }
    ]
  };
  const items = menus[role] || menus.citizen;
  return `
    <aside class="sidebar" style="width: var(--sidebar-width); height: 100vh; position: fixed; left: 0; top: 0; background: var(--bg-secondary); border-right: 1px solid var(--border-subtle); z-index: 100; display: flex; flex-direction: column; transition: transform 0.3s;">
      <div style="padding: 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border-subtle);">
        <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple)); display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-outlined" style="font-size: 20px; color: white;">account_balance</span>
        </div>
        <span style="font-weight: 700; font-size: var(--text-lg);">Civic Voice</span>
      </div>
      <nav style="flex: 1; padding: 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto;">
        ${items.map(item => `
          <div style="display: flex; flex-direction: column;">
            <a href="${item.href}" class="sidebar-item" data-id="${item.id}" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: var(--radius-md); color: ${activePage === item.id ? 'var(--primary-blue)' : 'var(--text-secondary)'}; background: ${activePage === item.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}; font-weight: ${activePage === item.id ? '600' : '400'}; font-size: var(--text-sm); transition: all 0.2s;">
              <span class="material-symbols-outlined" style="font-size: 20px;">${item.icon}</span>
              <span style="flex: 1;">${item.label}</span>
              ${item.hasStats && stats.total > 0 ? `<span style="background: rgba(59, 130, 246, 0.15); color: var(--primary-blue); border-radius: 10px; padding: 2px 7px; font-size: 0.72rem; font-weight: 700;">${stats.total}</span>` : ''}
            </a>
            ${item.hasStats && stats.total > 0 ? `
              <div style="display: flex; gap: 8px; padding: 2px 14px 6px 46px; font-size: 0.68rem; font-weight: 700; align-items: center;">
                <span style="color: var(--warning-amber); display: flex; align-items: center; gap: 2px;" title="Pending Complaints"><span class="material-symbols-outlined" style="font-size: 11px;">schedule</span> ${stats.pending} Pend</span>
                <span style="color: var(--text-tertiary); font-size: 0.6rem;">•</span>
                <span style="color: var(--success-green); display: flex; align-items: center; gap: 2px;" title="Resolved Complaints"><span class="material-symbols-outlined" style="font-size: 11px;">check_circle</span> ${stats.resolved} Res</span>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </nav>
      <div style="padding: 12px; border-top: 1px solid var(--border-subtle);">
        <button onclick="logout()" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: var(--radius-md); color: var(--text-tertiary); font-size: var(--text-sm); width: 100%; transition: all 0.2s;" onmouseover="this.style.background='rgba(239,68,68,0.1)';this.style.color='var(--danger-red)'" onmouseout="this.style.background='transparent';this.style.color='var(--text-tertiary)'">
          <span class="material-symbols-outlined" style="font-size: 20px;">logout</span>
          Logout
        </button>
      </div>
    </aside>
  `;
}

function renderTopNav(title) {
  const user = getUser();
  return `
    <header style="height: var(--topnav-height); background: var(--bg-secondary); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; padding: 0 var(--space-lg); position: sticky; top: 0; z-index: 50;">
      <h2 style="font-size: var(--text-lg); font-weight: 700;">${title}</h2>
      <div style="display: flex; align-items: center; gap: 16px;">
        <button style="position: relative; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%;" onmouseover="this.style.background='rgba(148,163,184,0.1)'" onmouseout="this.style.background='transparent'">
          <span class="material-symbols-outlined" style="font-size: 20px;">notifications</span>
          <span style="position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--danger-red); border-radius: 50%;"></span>
        </button>
        <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
          <div style="width: 34px; height: 34px; border-radius: 50%; background: var(--primary-blue); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: var(--text-sm);">
            ${user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);">${user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  `;
}
