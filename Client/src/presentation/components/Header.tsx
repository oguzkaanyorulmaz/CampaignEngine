import React from "react";

interface HeaderProps {
  activeTab: "portal" | "admin";
  onTabChange: (tab: "portal" | "admin") => void;
  selectedCustomerId?: number;
  onCustomerChange?: (id: number) => void;
  customerName?: string;
  onLogout: () => void;
  service?: any;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab, onTabChange, customerName, onLogout,
}) => {
  return (
    <header className="header">
      <div className="header-logo">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#FDBB30" />
          <path d="M11 13L20 30L29 13H23L20 22L17 13H11Z" fill="#111111" />
        </svg>
        VakıfBank <span>Campaign</span>
      </div>

      <nav style={{ display: "flex", gap: "8px" }}>
        <button
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "20px",
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: "pointer",
            background: activeTab === "portal" ? "#FDBB30" : "transparent",
            color: "#111111"
          }}
          onClick={() => onTabChange("portal")}
        >
          ?? Müşteri Portalı
        </button>
        <button
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "20px",
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: "pointer",
            background: activeTab === "admin" ? "#FDBB30" : "transparent",
            color: "#111111"
          }}
          onClick={() => onTabChange("admin")}
        >
          ?? Admin Tablosu
        </button>
      </nav>

      <div className="header-right">
        {activeTab === "portal" && (
          <div className="customer-select-wrap" style={{ cursor: "default" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748B" }}>Profil</span>
            <div className="user-avatar">??</div>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1A1D20", paddingRight: "6px" }}>
              {customerName || "Giriş Yapıldı"}
            </span>
          </div>
        )}

        <button className="btn-logout-outline" onClick={onLogout}>
          Güvenli Çıkış
          <span className="btn-logout-icon"></span>
        </button>
      </div>
    </header>
  );
};
