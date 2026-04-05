import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className={` 
        p-2 rounded-lg transition-all duration-200
        ${
          darkMode
            ? "bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-lg"
            : "bg-white text-gray-900 hover:bg-gray-50 shadow-md border"
        }
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50
        shadow-sm
      `}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Light mode" : "Dark mode"}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 hocus:text-yellow-300" />
      ) : (
        <Moon className="w-5 h-5 hocus:text-gray-700" />
      )}
    </button>
  );
};

export default DarkModeToggle;
