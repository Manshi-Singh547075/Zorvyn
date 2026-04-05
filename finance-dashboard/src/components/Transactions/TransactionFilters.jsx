import React from "react";
import { useApp } from "../../context/AppContext";
import { Search, Filter, ChevronDown } from "lucide-react";

const TransactionFilters = () => {
  const { filters, setFilters, transactions, loading } = useApp();

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Date (Newest)" },
    { value: "amount", label: "Amount (High to Low)" },
    { value: "description", label: "Description A-Z" },
  ];

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleTypeChange = (e) => {
    setFilters({ ...filters, type: e.target.value });
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split(":");
    setFilters({ ...filters, sortBy, sortOrder });
  };

  if (loading) {
    return (
      <div className="card p-4 mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 flex-1"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-40">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <div className="relative">
              <select
                value={filters.type}
                onChange={handleTypeChange}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 min-w-40">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <div className="relative">
              <select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={`${option.value.split(" ")[0]}:desc`}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
