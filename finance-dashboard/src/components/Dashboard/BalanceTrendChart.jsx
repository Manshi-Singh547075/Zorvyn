import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

export const BalanceTrendChart = () => {
  const { transactions, loading } = useApp();

  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Group transactions by month
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      // Use createdAt field from MockAPI
      const date = new Date(transaction.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          monthKey: monthKey,
          income: 0,
          expense: 0,
          balance: 0,
          transactionCount: 0
        };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
      
      monthlyData[monthKey].balance = monthlyData[monthKey].income - monthlyData[monthKey].expense;
      monthlyData[monthKey].transactionCount++;
    });
    
    // Convert to array and sort by date
    return Object.values(monthlyData)
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .map(({ month, income, expense, balance, transactionCount }) => ({
        month,
        income,
        expense,
        balance,
        transactionCount,
        // For tooltip formatting
        savingsRate: income > 0 ? ((balance / income) * 100).toFixed(1) : 0
      }));
  }, [transactions]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!chartData.length) return null;
    
    const latestMonth = chartData[chartData.length - 1];
    const previousMonth = chartData[chartData.length - 2];
    
    const trend = previousMonth 
      ? ((latestMonth.balance - previousMonth.balance) / Math.abs(previousMonth.balance)) * 100
      : 0;
    
    const avgBalance = chartData.reduce((sum, month) => sum + month.balance, 0) / chartData.length;
    const bestMonth = chartData.reduce((best, month) => 
      month.balance > best.balance ? month : best, chartData[0]);
    
    return {
      latestBalance: latestMonth.balance,
      trend: trend.toFixed(1),
      avgBalance: avgBalance.toFixed(0),
      bestMonth: bestMonth.month,
      bestBalance: bestMonth.balance
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-green-600 dark:text-green-400">
              Income: ${payload[0]?.value?.toLocaleString()}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              Expenses: ${payload[1]?.value?.toLocaleString()}
            </p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Balance: ${payload[2]?.value?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Savings Rate: {payload[2]?.payload.savingsRate}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Balance Trend</h3>
          <div className="animate-pulse w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Balance Trend</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Add transactions to see your balance trend
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      {/* Header with summary stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Balance Trend
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monthly income vs expenses analysis
          </p>
        </div>
        
        {summary && (
          <div className="mt-3 sm:mt-0 flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Current Balance</p>
              <p className={`font-semibold ${summary.latestBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(summary.latestBalance).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Trend</p>
              <p className={`font-semibold ${summary.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.trend >= 0 ? '↑' : '↓'} {Math.abs(summary.trend)}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#9CA3AF' }}
            />
            
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#9CA3AF' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-gray-700 dark:text-gray-300 capitalize">{value}</span>
              )}
            />
            
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#colorIncome)"
              name="Income"
            />
            
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#colorExpense)"
              name="Expenses"
            />
            
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: '#6366F1', r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#818CF8', strokeWidth: 2 }}
              name="Net Balance"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Additional insights */}
      {summary && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Average Monthly Balance</p>
              <p className="font-medium text-gray-900 dark:text-white">
                ${parseInt(summary.avgBalance).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Best Month</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {summary.bestMonth} (${summary.bestBalance.toLocaleString()})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};