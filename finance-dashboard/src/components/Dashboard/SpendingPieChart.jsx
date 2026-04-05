import React, { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Sector
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { PieChart as PieChartIcon, TrendingUp, AlertCircle } from 'lucide-react';

// Color palette for categories
const COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#D946EF', // Fuchsia
];

const RADIAN = Math.PI / 180;

// Custom label renderer
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

// Active shape for hover effect
const renderActiveShape = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={-8} textAnchor={textAnchor} fill="#333" className="dark:fill-white font-medium">
        {payload.name}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={0} textAnchor={textAnchor} fill="#999" className="dark:fill-gray-400 text-sm">
        ${value.toLocaleString()}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={8} textAnchor={textAnchor} fill="#999" className="dark:fill-gray-400 text-xs">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

export const SpendingPieChart = () => {
  const { transactions, loading } = useApp();
  const [activeIndex, setActiveIndex] = useState(null);

  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Filter only expense transactions
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (!expenses.length) return [];

    // Group by category and sum amounts
    const categoryMap = new Map();
    
    expenses.forEach(transaction => {
      const category = transaction.category || 'Other';
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + transaction.amount);
    });
    
    // Convert to array and sort by amount (descending)
    const data = Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        originalName: name
      }))
      .sort((a, b) => b.value - a.value);
    
    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Add percentage to each item
    return data.map(item => ({
      ...item,
      percentage: ((item.value / total) * 100).toFixed(1)
    }));
  }, [transactions]);

  const summary = useMemo(() => {
    if (!chartData.length) return null;
    
    const totalSpending = chartData.reduce((sum, item) => sum + item.value, 0);
    const topCategory = chartData[0];
    const top3Total = chartData.slice(0, 3).reduce((sum, item) => sum + item.value, 0);
    const top3Percentage = (top3Total / totalSpending) * 100;
    
    return {
      totalSpending,
      topCategory: topCategory?.name,
      topCategoryAmount: topCategory?.value,
      topCategoryPercentage: topCategory?.percentage,
      top3Percentage: top3Percentage.toFixed(1),
      categoryCount: chartData.length
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {data.name}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Amount: <span className="font-medium">${data.value.toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Percentage: <span className="font-medium">{data.percentage}%</span>
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full" 
                style={{ width: `${data.percentage}%` }}
              />
            </div>
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Breakdown</h3>
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
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Spending Breakdown</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <PieChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Add expense transactions to see breakdown
            </p>
          </div>
        </div>
      </div>
    );
  }

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-indigo-600" />
            Spending Breakdown
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Expenses by category
          </p>
        </div>
        
        {summary && (
          <div className="mt-3 sm:mt-0 flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Total Spent</p>
              <p className="font-semibold text-red-600">
                ${summary.totalSpending.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Categories</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {summary.categoryCount}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value, entry, index) => (
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {value} ({chartData[index]?.percentage}%)
                </span>
              )}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top spending insight */}
      {summary && summary.topCategory && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Top Spending Category
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">{summary.topCategory}</span> accounts for 
                  {' '}{summary.topCategoryPercentage}% of total spending 
                  (${summary.topCategoryAmount.toLocaleString()})
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Top 3 categories make up {summary.top3Percentage}% of your total expenses
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning for high spending concentration */}
      {summary && summary.topCategoryPercentage > 50 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-4 h-4" />
          <span>High spending concentration - consider diversifying your expenses</span>
        </div>
      )}
    </div>
  );
};