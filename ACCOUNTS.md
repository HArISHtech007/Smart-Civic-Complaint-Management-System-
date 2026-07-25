# Civic Voice — User Credentials Matrix

Below is the list of all pre-configured system accounts, roles, credentials, and access levels for the **Smart Civic Complaint Management System**.

---

## 🔑 System Accounts

| Role | Name | Email | Password | Department | Access Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | Admin Dharun | `dharun@admin.com` | `12345678` | System Admin | System-wide Admin Portal, User Management, Department Setup, Analytics |
| 🛡️ **Admin** | Admin Boss | `admin@example.com` | `password123` | System Admin | Full Admin Access & Department Configuration |
| 👔 **Head Officer** | Carol Head | `carol@example.com` | `password123` | Solid Waste Management | Department Overview, Officer Assignment, Analytics |
| 🚧 **Field Officer** | Officer Bob | `officer@example.com` | `password123` | Roads & Highways | Field Queue, GPS Map View, Live Work Proof Resolution |
| 👤 **Citizen** | John Citizen | `citizen@example.com` | `password123` | General Citizen | Report Issue, GPS Pinned Marker, Track Complaints |
| 👤 **Citizen** | Dharun | `dharun6@civic.com` | `12345678` | General Citizen | Citizen Dashboard & Issue Submission |

---

## 💡 Role-Based Redirection Matrix

When logging in through the portal (`/login.html`), the system routes users based on their role:

- **Admin** $\rightarrow$ `/admin/dashboard.html`
- **Head Officer** $\rightarrow$ `/head-officer/dashboard.html`
- **Field Officer** $\rightarrow$ `/officer/dashboard.html`
- **Citizen** $\rightarrow$ `/citizen/dashboard.html`

---

## ⚙️ Offline & Mock Authentication Rules

1. **Auto-Role Inference**: In offline/mock mode, entering any email containing `admin` grants Admin privileges, `head` grants Head Officer access, `officer` grants Field Officer access, and all other emails route as Citizen accounts.
2. **Custom Admin Created Accounts**: Users created dynamically in the Admin Panel (**Users Management**) are automatically saved to persistent browser storage (`civic_custom_users`).
