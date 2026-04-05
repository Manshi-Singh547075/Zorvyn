import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, ChevronDown, User, Settings, Eye, Lock, Check } from 'lucide-react';

export const RoleSwitcher = () => {
  const { role, setRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen]);

  const roles = [
    {
      id: 'viewer',
      name: 'Viewer',
      icon: Eye,
      description: 'Can only view data',
      color: 'blue',
      permissions: ['View transactions', 'View insights', 'View charts']
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: Shield,
      description: 'Full access to manage data',
      color: 'purple',
      permissions: ['View transactions', 'Add transactions', 'Edit transactions', 'Delete transactions', 'Manage categories']
    }
  ];

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setIsOpen(false);
    
    // Optional: Show a toast/notification
    const message = newRole === 'admin' 
      ? '👑 Admin mode activated. You can now add, edit, and delete transactions.'
      : '👁️ Viewer mode activated. You can only view data.';
    
    // You can integrate with a toast library here
    console.log(message);
  };

  const getRoleIcon = () => {
    const currentRole = roles.find(r => r.id === role);
    return currentRole ? currentRole.icon : Shield;
  };

  const getRoleColor = () => {
    return role === 'admin' 
      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  };

  if (!mounted) {
    return (
      <div className="relative">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
          <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
          <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
        </button>
      </div>
    );
  }

  const RoleIcon = getRoleIcon();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Role Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
          ${getRoleColor()}
          hover:shadow-md active:scale-95
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
        `}
        aria-label="Change user role"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <RoleIcon className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline capitalize">
          {role}
        </span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-slideDown">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Select Role Mode
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Role determines what actions you can perform
            </p>
          </div>

          {/* Role Options */}
          <div className="p-2">
            {roles.map((roleOption) => {
              const isActive = role === roleOption.id;
              const Icon = roleOption.icon;
              
              return (
                <button
                  key={roleOption.id}
                  onClick={() => handleRoleChange(roleOption.id)}
                  className={`
                    w-full text-left p-3 rounded-lg transition-all duration-200 mb-1 last:mb-0
                    ${isActive 
                      ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`
                      p-2 rounded-lg
                      ${roleOption.color === 'purple' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {roleOption.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {roleOption.description}
                          </p>
                        </div>
                        {isActive && (
                          <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>

                      {/* Permissions list */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {roleOption.permissions.map((perm, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer with info */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              {role === 'admin' 
                ? '✨ You have full access to manage transactions'
                : '🔒 Viewer mode: Read-only access'}
            </p>
          </div>
        </div>
      )}

      {/* Add animation styles to your CSS */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

// Alternative: Simplified version (compact)
export const CompactRoleSwitcher = () => {
  const { role, setRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = [
    { id: 'viewer', label: 'Viewer', icon: Eye, color: 'blue' },
    { id: 'admin', label: 'Admin', icon: Shield, color: 'purple' }
  ];

  const currentRole = roles.find(r => r.id === role);
  const Icon = currentRole?.icon || Shield;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <Icon className="w-3 h-3" />
        <span className="capitalize">{role}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {roles.map((r) => {
            const RoleIcon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                  role === r.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                }`}
              >
                <RoleIcon className="w-3 h-3" />
                <span>{r.label}</span>
                {role === r.id && <Check className="w-3 h-3 ml-auto" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Alternative: Toggle Switch Style
export const ToggleRoleSwitcher = () => {
  const { role, setRole } = useApp();
  
  const toggleRole = () => {
    setRole(role === 'admin' ? 'viewer' : 'admin');
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs ${role === 'viewer' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500'}`}>
        Viewer
      </span>
      <button
        onClick={toggleRole}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${role === 'admin' ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}
        `}
        aria-label="Toggle role"
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${role === 'admin' ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      <span className={`text-xs ${role === 'admin' ? 'text-purple-600 dark:text-purple-400 font-medium' : 'text-gray-500'}`}>
        Admin
      </span>
    </div>
  );
};

// Default export
export default RoleSwitcher;