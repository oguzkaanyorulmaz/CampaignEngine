import React, { useEffect, useState, useMemo } from "react";
import type { CustomerDashboardDto } from "../core/types/api.types";
import { DashboardRepository } from "../infrastructure/repositories/DashboardRepository";
import { DashboardService } from "../application/services/DashboardService";
import { Header } from "./components/Header";
import { SidebarSummary } from "./components/SidebarSummary";
import { CardList } from "./components/CardList";
import { AccountList } from "./components/AccountList";
import { TransactionTable } from "./components/TransactionTable";
import { CampaignWidget } from "./components/CampaignWidget";
import { LoginPage } from "./components/auth/LoginPage";

const repo = new DashboardRepository();
const service = new DashboardService(repo);

export const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [customerId, setCustomerId] = useState<number>(() => {
    const saved = localStorage.getItem("customerId");
    return saved ? Number(saved) : 1;
  });
  const [customerName, setCustomerName] = useState<string>(() => {
    return localStorage.getItem("customerName") || "";
  });

  const [activeView, setActiveView] = useState<"cards" | "accounts">("cards");
  const [dashboard, setDashboard] = useState<CustomerDashboardDto | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = (id: number, name: string) => {
    setCustomerId(id);
    setCustomerName(name);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("customerId", id.toString());
    localStorage.setItem("customerName", name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerName");
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    service.loadDashboard(customerId)
      .then((data) => {
        setDashboard(data);
        if (data.customerName) {
          setCustomerName(data.customerName);
          localStorage.setItem("customerName", data.customerName);
        }
        if (data.creditCards.length > 0) {
          setSelectedCardId(data.creditCards[0].creditCardId);
        }
        if (data.bankAccounts.length > 0) {
          setSelectedAccountId(data.bankAccounts[0].accountId);
        }
      })
      .catch(() => setDashboard(null))
      .finally(() => setLoading(false));
  }, [customerId, isLoggedIn]);

  const selectedCard = useMemo(
    () => dashboard?.creditCards.find((c) => c.creditCardId === selectedCardId) ?? null,
    [dashboard, selectedCardId]
  );

  const selectedAccount = useMemo(
    () => dashboard?.bankAccounts.find((a) => a.accountId === selectedAccountId) ?? null,
    [dashboard, selectedAccountId]
  );

  const handleJoin = async (campaignId: number) => {
    return service.joinCampaign(customerId, campaignId);
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <Header
        customerName={dashboard?.customerName || customerName}
        onLogout={handleLogout}
      />

      {loading ? (
        <div className="loading-box">VakıfBank Müşteri Portalı Yükleniyor...</div>
      ) : dashboard ? (
        <div className="dashboard-container">
          <SidebarSummary
            totalBalance={dashboard.totalAccountBalance}
            totalCreditLimit={dashboard.totalCreditCardAvailableLimit}
            accountCount={dashboard.bankAccounts.length}
            cardCount={dashboard.creditCards.length}
            activeView={activeView}
            onSelectView={setActiveView}
          />

          <main>
            {activeView === "cards" ? (
              <>
                <CardList
                  customerName={dashboard.customerName || customerName}
                  cards={dashboard.creditCards}
                  selectedCardId={selectedCardId}
                  onSelectCard={setSelectedCardId}
                />
                {selectedCard && (
                  <div className="txn-section">
                    <TransactionTable
                      transactions={selectedCard.recentTransactions}
                      currentBalance={selectedCard.availableLimit}
                      balanceLabel="Kullanılabilir Limit"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <AccountList
                  customerName={dashboard.customerName || customerName}
                  accounts={dashboard.bankAccounts}
                  selectedAccountId={selectedAccountId}
                  onSelectAccount={setSelectedAccountId}
                />
                {selectedAccount && (
                  <div className="txn-section">
                    <TransactionTable
                      transactions={selectedAccount.recentTransactions}
                      currentBalance={selectedAccount.balance}
                      balanceLabel="Kalan Bakiye"
                    />
                  </div>
                )}
              </>
            )}
          </main>

          <CampaignWidget
            recommendation={dashboard.recommendedCampaign}
            activeCampaigns={dashboard.activeCampaigns}
            redeemedCampaigns={dashboard.redeemedCampaigns}
            onJoin={handleJoin}
          />
        </div>
      ) : (
        <div className="empty-state">Müşteri verisi bulunamadı.</div>
      )}
    </>
  );
};
