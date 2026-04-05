import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';

export const SummaryCards = () => {
  const { transactions, loading, role } = useApp();
  const [animatedValues, setAnimatedValues] = useState({
    balance: 0,
    income: 0,
    expense: 0
  });

  const stats = useMemo(() => {
    if (!transactions.length) {
      return { 
        totalIncome: 0, 
        totalExpense: 0, 
        balance: 0, 
        transactionCount: 0,
        averageTransaction: 0,
        incomeCount: 0,
        expenseCount: 0
      };
    }

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    const transactionCount = transactions.length;
    const incomeCount = transactions.filter(t => t.type === 'income').length;
    const expenseCount = transactions.filter(t => t.type === 'expense').length;
    const averageTransaction = transactionCount > 0 
      ? (totalIncome + totalExpense) / transactionCount 
      : 0;
    
    return { 
      totalIncome, 
      totalExpense, 
      balance, 
      transactionCount,
      averageTransaction,
      incomeCount,
      expenseCount
    };
  }, [transactions]);

  // Animate numbers on change
  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    
    const animateValue = (start, end, setter) => {
      if (start === end) return;
      const difference = end - start;
      let current = start;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        current = start + (difference * (step / steps));
        if (step >= steps) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, stepTime);
      
      return timer;
    };
    
    const timers = [];
    timers.push(animateValue(animatedValues.balance, stats.balance, (val) => 
      setAnimatedValues(prev => ({ ...prev, balance: val }))
    ));
    timers.push(animateValue(animatedValues.income, stats.totalIncome, (val) => 
      setAnimatedValues(prev => ({ ...prev, income: val }))
    ));
    timers.push(animateValue(animatedValues.expense, stats.totalExpense, (val) => 
      setAnimatedValues(prev => ({ ...prev, expense: val }))
    ));
    
    return () => timers.forEach(timer => timer && clearInterval(timer));
  }, [stats.balance, stats.totalIncome, stats.totalExpense]);

  // Calculate percentage changes (mock - in real app you'd compare with previous period)
  const percentageChange = useMemo(() => {
    const lastMonthIncome = stats.totalIncome * 0.85; // Mock data
    const lastMonthExpense = stats.totalExpense * 1.1;
    
    return {
      income: ((stats.totalIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1),
      expense: ((stats.totalExpense - lastMonthExpense) / lastMonthExpense * 100).toFixed(1),
      balance: stats.balance > 0 ? '+12.5' : '-8.3'
    };
  }, [stats]);

  const cards = [
    { 
      title: 'Total Balance', 
      value: animatedValues.balance,
      formattedValue: `$${Math.abs(animatedValues.balance).toLocaleString()}`,
      icon: Wallet, 
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      gradient: 'from-indigo-500 to-purple-600',
      trend: percentageChange.balance,
      trendPositive: stats.balance >= 0,
      subtitle: 'Current net worth',
      prefix: stats.balance < 0 ? '-$' : '$'
    },
    { 
      title: 'Total Income', 
      value: animatedValues.income,
      formattedValue: `$${animatedValues.income.toLocaleString()}`,
      icon: TrendingUp, 
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      gradient: 'from-emerald-500 to-teal-600',
      trend: percentageChange.income,
      trendPositive: true,
      subtitle: 'All time earnings',
      prefix: '+$'
    },
    { 
      title: 'Total Expenses', 
      value: animatedValues.expense,
      formattedValue: `$${animatedValues.expense.toLocaleString()}`,
      icon: TrendingDown, 
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-100 dark:bg-rose-900/30',
      gradient: 'from-rose-500 to-pink-600',
      trend: percentageChange.expense,
      trendPositive: false,
      subtitle: 'All time spending',
      prefix: '-$'
    },
  ];

  // Additional stats card
  const additionalStats = {
    avgTransaction: stats.averageTransaction,
    transactionCount: stats.transactionCount,
    incomeVsExpense: stats.totalIncome > 0 
      ? ((stats.totalExpense / stats.totalIncome) * 100).toFixed(1)
      : 0
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stats.transactionCount === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="card p-6 text-center">
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-full ${card.iconBg} mb-3`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $0
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Add transactions to see data
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            <div className="relative p-6">
              {/* Header with Icon */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {card.formattedValue}
                    </p>
                    {/* Trend Indicator */}
                    <div className={`flex items-center gap-0.5 text-xs font-medium ${
                      card.trendPositive 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {card.trendPositive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span>{Math.abs(parseFloat(card.trend))}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {card.subtitle}
                  </p>
                </div>
                
                {/* Icon with Pulse Animation */}
                <div className={`relative ${card.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  <div className={`absolute inset-0 rounded-xl ${card.iconBg} animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </div>

              {/* Progress Bar for Balance Card */}
              {idx === 0 && stats.totalIncome > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Expense Ratio</span>
                    <span>{additionalStats.incomeVsExpense}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(additionalStats.incomeVsExpense, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Footer with Additional Info */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>Last 30 days</span>
                </div>
                {role === 'admin' && idx === 2 && (
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    <span>Details</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Average Transaction Card */}
        <div className="card p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Average Transaction</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${Math.round(additionalStats.avgTransaction).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Count Card */}
        <div className="card p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Wallet className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Transactions</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.transactionCount}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {stats.incomeCount} income · {stats.expenseCount} expenses
              </p>
            </div>
          </div>
        </div>

        {/* Role Indicator Card */}
        <div className="card p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${role === 'admin' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
              {role === 'admin' ? (
                <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current Mode</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {role}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {role === 'admin' ? 'Full access enabled' : 'Read-only mode'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};