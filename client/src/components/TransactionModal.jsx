import { useState, useEffect } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { X } from 'lucide-react';
import { categories } from '../utils/mockData';

export default function TransactionModal({ isOpen, onClose, editingTransaction = null }) {
  const { addTransaction, editTransaction } = useFinanceStore();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'Expense',
    category: categories[4], // Default 'Housing' for Expense, or similar
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        ...editingTransaction,
        // Make sure amount is a string for input field
        amount: editingTransaction.amount.toString(),
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        type: 'Expense',
        category: 'Housing',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingTransaction, isOpen]);

  // Adjust default category when type changes
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData(prev => ({
      ...prev,
      type: newType,
      category: newType === 'Income' ? 'Salary' : 'Housing'
    }));
  };

  const incomeCategories = categories.slice(0, 4);
  const expenseCategories = categories.slice(4);

  const availableCategories = formData.type === 'Income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category || !formData.date) return;

    const payload = {
      ...formData,
      amount: Number(formData.amount)
    };

    if (editingTransaction) {
      editTransaction({ ...payload, id: editingTransaction.id });
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-textMuted hover:text-white transition-colors bg-surface/50 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6">
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Type</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`cursor-pointer text-center py-2 rounded-xl border transition-all ${
                formData.type === 'Income' 
                  ? 'bg-secondary/20 border-secondary text-secondary font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : 'bg-surface border-borderLight text-textMuted hover:bg-surface/80'
              }`}>
                <input 
                  type="radio" 
                  name="type" 
                  value="Income" 
                  checked={formData.type === 'Income'}
                  onChange={handleTypeChange}
                  className="hidden" 
                />
                Income
              </label>
              <label className={`cursor-pointer text-center py-2 rounded-xl border transition-all ${
                formData.type === 'Expense' 
                  ? 'bg-accent/20 border-accent text-accent font-medium shadow-[0_0_15px_rgba(244,63,94,0.2)]' 
                  : 'bg-surface border-borderLight text-textMuted hover:bg-surface/80'
              }`}>
                <input 
                  type="radio" 
                  name="type" 
                  value="Expense" 
                  checked={formData.type === 'Expense'}
                  onChange={handleTypeChange}
                  className="hidden" 
                />
                Expense
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted">₹</span>
              <input 
                type="number" 
                min="0"
                step="0.01"
                required
                value={formData.amount}
                onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="input-field pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Description</label>
            <input 
              type="text" 
              required
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input-field"
              placeholder="e.g., Grocery Shopping"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Category</label>
              <select 
                required
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="input-field appearance-none"
              >
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Date</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="input-field [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 btn-primary"
            >
              {editingTransaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
