import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Button } from "../UI/Button";
import { X, Save, Plus } from "lucide-react";

const TransactionForm = ({ transaction: editingTransaction, onClose }) => {
  const { addTransaction, editTransaction, role, refreshTransactions } =
    useApp();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "Groceries",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Groceries",
    "Dining",
    "Transportation",
    "Bills",
    "Entertainment",
    "Shopping",
    "Rent",
    "Other",
  ];

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description:
          editingTransaction.description || editingTransaction.name || "",
        amount: editingTransaction.amount || "",
        type: editingTransaction.type || "expense",
        category: editingTransaction.category || "Other",
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        type: "expense",
        category: "Groceries",
      });
    }
  }, [editingTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingTransaction) {
        const result = await editTransaction(editingTransaction.id, formData);
        if (result.success) {
          onClose();
        } else {
          setError(result.error);
        }
      } else {
        const result = await addTransaction(formData);
        if (result.success) {
          onClose();
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  if (role !== "admin") {
    return null; // Viewer can't access form
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. Grocery shopping"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingTransaction ? "Update" : "Add"} Transaction
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { TransactionForm };
