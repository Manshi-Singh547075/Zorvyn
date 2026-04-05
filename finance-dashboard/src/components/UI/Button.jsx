import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};