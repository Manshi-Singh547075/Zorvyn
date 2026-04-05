import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/transactionService';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(() => {
    return localStorage.getItem('userRole') || 'viewer';
  });
  
  // Fix: Initialize darkMode from localStorage and apply to HTML
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedMode !== null ? savedMode === 'true' : prefersDark;
  });
  
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    console.log('Dark mode changed:', darkMode); // Debug log
  }, [darkMode]);

  // Load transactions from API
  const loadTransactions = useCallback(async () => {
    setLoading(true);
    const result = await fetchTransactions(filters, role);
    if (result.success) {
      setTransactions(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [filters, role]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  const addTransaction = async (transaction) => {
    const result = await createTransaction(transaction, role);
    if (result.success) {
      await loadTransactions();
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  };

  const editTransaction = async (id, transaction) => {
    const result = await updateTransaction(id, transaction, role);
    if (result.success) {
      await loadTransactions();
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  };

  const removeTransaction = async (id) => {
    const result = await deleteTransaction(id, role);
    if (result.success) {
      await loadTransactions();
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  return (
    <AppContext.Provider value={{
      transactions,
      loading,
      error,
      role,
      setRole,
      darkMode,
      setDarkMode,
      filters,
      setFilters,
      addTransaction,
      editTransaction,
      removeTransaction,
      refreshTransactions: loadTransactions,
    }}>
      {children}
    </AppContext.Provider>
  );
};