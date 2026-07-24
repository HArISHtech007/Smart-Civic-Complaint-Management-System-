function renderSidebar(activePage) {
  const role = getRole();
  const menus = {
    citizen: [
      { icon: 'dashboard', label: 'Dashboard', href: '/citizen/dashboard.html', id: 'dashboard' },
      { icon: 'add_circle', label: 'Report Issue', href: '/citizen/submit.html', id: 'submit' },
      { icon: 'list_alt', label: 'My Complaints', href: '/citizen/track.html', id: 'track' },
      { icon: 'notifications', label: 'Notifications', href: '/citizen/notifications.html', id: 'notifications' }
    ],
    officer: [
      { icon: 'dashboard', label: 'Dashboard', href: '/officer/dashboard.html', id: 'dashboard' },
      { icon: 'list_alt', label: 'Complaints', href: '/officer/complaints.html', id: 'complaints' },
      { icon: 'map', label: 'Map View', href: '/officer/map.html', id: 'map' },
      { icon: 'notifications', label: 'Notifications', href: '/officer/notifications.html', id: 'notifications' }
    ],
    head_officer: [
      { icon: 'dashboard', label: 'Dashboard', href: '/head-officer/dashboard.html', id: 'dashboard' },
      { icon: 'people', label: 'Officers', href: '/head-officer/officers.html', id: 'officers' },
      { icon: 'list_alt', label: 'Complaints', href: '/head-officer/complaints.html', id: 'complaints' },
      { icon: 'analytics', label: 'Analytics', href: '/head-officer/analytics.html', id: 'analytics' }
    ],
    admin: [
      { icon: 'dashboard', label: 'Dashboard', href: '/admin/dashboard.html', id: 'dashboard' },
      { icon: 'list_alt', label: 'Complaints', href: '/admin/complaints.html', id: 'complaints' },
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
      <nav style="flex: 1; padding: 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto;">
        ${items.map(item => `
          <a href="${item.href}" class="sidebar-item" data-id="${item.id}" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: var(--radius-md); color: ${activePage === item.id ? 'var(--primary-blue)' : 'var(--text-secondary)'}; background: ${activePage === item.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}; font-weight: ${activePage === item.id ? '600' : '400'}; font-size: var(--text-sm); transition: all 0.2s;">
            <span class="material-symbols-outlined" style="font-size: 20px;">${item.icon}</span>
            ${item.label}
          </a>
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
      <div style="display: flex; align-items: center; gap: var(--space-md);">
        <button class="sidebar-toggle" style="display: none; color: var(--text-secondary);" onclick="document.querySelector('.sidebar').style.transform='translateX(0)'">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <h2 style="font-size: var(--text-xl); font-weight: 700;">${title || 'Dashboard'}</h2>
      </div>
      <div style="display: flex; align-items: center; gap: var(--space-md);">
        <button style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: var(--text-secondary);" onmouseover="this.style.background='rgba(148,163,184,0.1)'" onmouseout="this.style.background='transparent'">
          <span class="material-symbols-outlined">notifications</span>
          <span style="position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%; background: var(--danger-red);"></span>
        </button>
        <div style="display: flex; align-items: center; gap: var(--space-sm); padding: 4px 12px 4px 4px; border-radius: var(--radius-full); cursor: pointer;" onmouseover="this.style.background='rgba(148,163,184,0.08)'" onmouseout="this.style.background='transparent'">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple)); display: flex; align-items: center; justify-content: center; color: white; font-size: var(--text-sm); font-weight: 600;">
            ${user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span style="font-size: var(--text-sm); font-weight: 500; color: var(--text-primary);">${user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  `;
}
