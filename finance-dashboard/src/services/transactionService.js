import axios from 'axios';

// Use environment variable directly
const API_URL = import.meta.env.VITE_API_BASE_URL ;

console.log('Transaction Service using API_URL:', API_URL); // Debug log

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to check permissions
const checkPermission = (role, action) => {
  if (role === 'viewer' && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(action)) {
    throw new Error('Viewer role cannot modify data');
  }
  return true;
};

// Fetch all transactions
export const fetchTransactions = async (filters = {}, role = 'viewer') => {
  try {
    const params = new URLSearchParams();
    
    if (filters.sortBy && filters.sortOrder) {
      params.append('sortBy', filters.sortBy);
      params.append('order', filters.sortOrder);
    }
    
    if (filters.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : '';
    
    console.log('Fetching from:', API_URL + url); // Debug log
    
    const response = await apiClient.get(url);
    
    return {
      success: true,
      data: response.data,
      total: Array.isArray(response.data) ? response.data.length : 0,
    };
  } catch (error) {
    console.error('Fetch transactions error:', error);
    console.error('Error details:', error.response?.data);
    
    // Return mock data if API fails
    return {
      success: false,
      error: error.message,
      data: getMockTransactions(),
    };
  }
};

// Get single transaction by ID
export const fetchTransactionById = async (id) => {
  try {
    const response = await apiClient.get(`/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Fetch transaction error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create new transaction
export const createTransaction = async (transaction, role = 'admin') => {
  try {
    checkPermission(role, 'POST');
    
    const newTransaction = {
      ...transaction,
      createdAt: new Date().toISOString(),
      avatar: 'https://avatars.githubusercontent.com/u/39316849',
      name: transaction.description || transaction.name,
    };
    
    const response = await apiClient.post('', newTransaction);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Create transaction error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update transaction
export const updateTransaction = async (id, transaction, role = 'admin') => {
  try {
    checkPermission(role, 'PUT');
    
    const response = await apiClient.put(`/${id}`, transaction);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Update transaction error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete transaction
export const deleteTransaction = async (id, role = 'admin') => {
  try {
    checkPermission(role, 'DELETE');
    
    const response = await apiClient.delete(`/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Delete transaction error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Mock data for fallback
const getMockTransactions = () => {
  return [
    {
      id: '1',
      createdAt: new Date().toISOString(),
      name: 'Sample Income',
      amount: 3500,
      type: 'income',
      category: 'Salary',
      description: 'Sample transaction',
    },
    {
      id: '2',
      createdAt: new Date().toISOString(),
      name: 'Sample Expense',
      amount: 120,
      type: 'expense',
      category: 'Food',
      description: 'Sample expense',
    },
  ];
};