const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;


export const API_URL = API_BASE_URL;

// MockAPI.io specific query parameters
export const buildQueryParams = (filters) => {
  const params = new URLSearchParams();
  
  if (filters.type && filters.type !== 'all') {
    params.append('type', filters.type);
  }
  
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  if (filters.sortBy) {
    params.append('sortBy', filters.sortBy);
    params.append('order', filters.sortOrder === 'asc' ? 'asc' : 'desc');
  }
  
  return params.toString();
};