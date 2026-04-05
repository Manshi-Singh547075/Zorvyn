import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { SummaryCards } from "./components/Dashboard/SummaryCards";
import { BalanceTrendChart } from "./components/Dashboard/BalanceTrendChart";
import { SpendingPieChart } from "./components/Dashboard/SpendingPieChart";
import { TransactionList } from "./components/Transactions/TransactionList";
import TransactionFilters from "./components/Transactions/TransactionFilters";
import { InsightSection } from "./components/Insights/InsightSection";
import { Header } from "./components/Layout/Header";

const DashboardContent = () => {
  const { loading, transactions } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SummaryCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <BalanceTrendChart />
          <SpendingPieChart />
        </div>

        <InsightSection />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Transaction History
            </h2>
            {!loading && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {transactions?.length || 0} transactions
              </p>
            )}
          </div>
          <TransactionFilters />
          <TransactionList />
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}

export default App;
