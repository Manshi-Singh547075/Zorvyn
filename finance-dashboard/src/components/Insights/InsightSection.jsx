import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  AlertCircle,
  Calendar,
  Award,
  Target,
  Zap,
  BarChart3,
  Wallet,
  Coffee,
  ShoppingBag,
  Car,
  Home,
  Film
} from 'lucide-react';

export const InsightSection = () => {
  const { transactions, loading } = useApp();

  const insights = useMemo(() => {
    if (!transactions.length) {
      return {
        hasData: false,
        message: "Add transactions to see insights"
      };
    }

    // Calculate total income and expenses
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Find highest spending category
    const categorySpending = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const category = t.category || 'Other';
        categorySpending[category] = (categorySpending[category] || 0) + t.amount;
      });
    
    let highestCategory = { name: 'None', amount: 0 };
    let secondHighestCategory = { name: 'None', amount: 0 };
    
    Object.entries(categorySpending).forEach(([name, amount]) => {
      if (amount > highestCategory.amount) {
        secondHighestCategory = highestCategory;
        highestCategory = { name, amount };
      } else if (amount > secondHighestCategory.amount) {
        secondHighestCategory = { name, amount };
      }
    });

    // Monthly comparison (current month vs last month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthExpenses = transactions
      .filter(t => {
        const date = new Date(t.createdAt);
        return t.type === 'expense' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = transactions
      .filter(t => {
        const date = new Date(t.createdAt);
        return t.type === 'expense' && 
               date.getMonth() === lastMonth && 
               date.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyChange = lastMonthExpenses > 0 
      ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    // Average daily spending
    const uniqueDays = new Set(
      transactions
        .filter(t => t.type === 'expense')
        .map(t => new Date(t.createdAt).toDateString())
    ).size;
    
    const avgDailySpending = uniqueDays > 0 ? totalExpense / uniqueDays : 0;

    // Top 3 expense transactions
    const topExpenses = [...transactions]
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    return {
      hasData: true,
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate: savingsRate.toFixed(1),
      highestCategory,
      secondHighestCategory,
      monthlyChange: monthlyChange.toFixed(1),
      currentMonthExpenses,
      lastMonthExpenses,
      avgDailySpending: avgDailySpending.toFixed(0),
      topExpenses,
      transactionCount: transactions.length,
      expenseCount: transactions.filter(t => t.type === 'expense').length,
      incomeCount: transactions.filter(t => t.type === 'income').length,
    };
  }, [transactions]);

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Smart Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!insights.hasData) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Smart Insights</h2>
        <div className="card p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">{insights.message}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Start adding transactions to receive personalized financial insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Smart Insights
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Based on {insights.transactionCount} transactions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Savings Rate Card */}
        <div className="card p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className={`text-sm font-semibold ${insights.savingsRate >= 20 ? 'text-green-600' : insights.savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
              {insights.savingsRate}% Savings Rate
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Savings Rate</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${insights.netSavings.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Saved from ${insights.totalIncome.toLocaleString()} income
          </p>
          {insights.savingsRate < 10 && (
            <div className="mt-3 flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-3 h-3" />
              <span>Try to save at least 10% of income</span>
            </div>
          )}
        </div>

        {/* Highest Spending Category Card */}
        <div className="card p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Top Spending Category</h3>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {insights.highestCategory.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ${insights.highestCategory.amount.toLocaleString()}
          </p>
          {insights.secondHighestCategory.name !== 'None' && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              2nd: {insights.secondHighestCategory.name} (${insights.secondHighestCategory.amount.toLocaleString()})
            </p>
          )}
        </div>

        {/* Monthly Comparison Card */}
        <div className="card p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold ${insights.monthlyChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {insights.monthlyChange <= 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              {Math.abs(insights.monthlyChange)}%
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Monthly Spending Change</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${insights.currentMonthExpenses.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            vs ${insights.lastMonthExpenses.toLocaleString()} last month
          </p>
          {insights.monthlyChange > 0 && (
            <div className="mt-3 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3 h-3" />
              <span>Spending increased compared to last month</span>
            </div>
          )}
        </div>

        {/* Daily Average Card */}
        <div className="card p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Wallet className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Average Daily Spending</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${insights.avgDailySpending}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Based on {insights.expenseCount} expense transactions
          </p>
        </div>

        {/* Top Expenses Card */}
        <div className="card p-5 hover:shadow-lg transition-all md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Expenses</h3>
          </div>
          <div className="space-y-2">
            {insights.topExpenses.map((expense, idx) => (
              <div key={expense.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-gray-500 dark:text-gray-400 w-5">{idx + 1}.</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                    {expense.description || expense.name}
                  </span>
                </div>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  ${expense.amount.toLocaleString()}
                </span>
              </div>
            ))}
            {insights.topExpenses.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                No expenses recorded
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="card p-5 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Quick Stats</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Income Transactions</span>
              <span className="font-semibold text-green-600">{insights.incomeCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Expense Transactions</span>
              <span className="font-semibold text-red-600">{insights.expenseCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Income/Expense Ratio</span>
              <span className="font-semibold">
                {insights.totalIncome > 0 ? (insights.totalExpense / insights.totalIncome * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export
export default InsightSection;