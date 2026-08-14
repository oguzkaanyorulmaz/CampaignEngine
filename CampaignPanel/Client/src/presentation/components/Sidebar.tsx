interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  fullName: string;
  onLogout: () => void;
}

export default function Sidebar({ currentPage, onNavigate, fullName, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🏦 CampaignPanel</h2>
        <p>Admin Portalı</p>
      </div>

      <nav className="sidebar-nav">
        <button className={currentPage === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')}>
          <span className="nav-icon">📊</span> Dashboard
        </button>
        <button className={currentPage === 'create' ? 'active' : ''} onClick={() => onNavigate('create')}>
          <span className="nav-icon">➕</span> Yeni Kampanya
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{fullName.charAt(0).toUpperCase()}</div>
          <div>
            <div className="user-name">{fullName}</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout}>🚪 Çıkış Yap</button>
      </div>
    </aside>
  );
}
