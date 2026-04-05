import React from "react";
import { useApp } from "../../context/AppContext";
import { DarkModeToggle } from "../UI/DarkModeToggle";
import { RoleSwitcher } from "./RoleSwitcher";
import { Wallet, TrendingUp, Shield, Eye } from "lucide-react";

export const Header = () => {
  const { role, transactions } = useApp();

  // Calculate total balance for header display
  const totalBalance = React.useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return income - expense;
  }, [transactions]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block space-y-1 py-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400 leading-tight">
                FinanceFlow
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Smart Finance Tracker
              </p>
            </div>
          </div>

          {/* Balance Indicator (Desktop) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Balance:
            </span>
            <span
              className={`text-sm font-semibold ${totalBalance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              ${totalBalance.toLocaleString()}
            </span>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Role indicator badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
              {role === "admin" ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                    Admin
                  </span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Viewer
                  </span>
                </>
              )}
            </div>

            {/* Dark mode toggle */}
            <DarkModeToggle />

            {/* Role switcher */}
            <RoleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

// Also export a simple version if needed
export const SimpleHeader = () => {
  const { role } = useApp();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              FinanceFlow
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
              {role}
            </span>
            <DarkModeToggle />
            <RoleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

// Icons already imported above

// Default export
export default Header;
