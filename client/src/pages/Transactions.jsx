import { useState, useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Search, Plus, Trash2, Edit2, Filter, ArrowUpDown, FileText, FileJson } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import TransactionModal from '../components/TransactionModal';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

export default function Transactions() {
  const { transactions, role, deleteTransaction } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Income, Expense
  const [sortOrder, setSortOrder] = useState('desc'); // desc, asc for Date
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const handleOpenAdd = () => {
    setEditingTx(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const filteredAndSorted = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' ? true : t.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [transactions, searchTerm, filterType, sortOrder]);

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 fade-in">
        <h2 className="text-2xl font-bold text-textMain">Transactions</h2>
        {role === 'Admin' && (
          <button 
            onClick={handleOpenAdd}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        )}
      </div>

      <div className="glass-panel p-6 card-enter">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
            <input 
              type="text" 
              placeholder="Search by description or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="All">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
            </div>
            
            <button 
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort</span>
            </button>

            <div className="flex space-x-2 border-l border-borderLight pl-4 ml-2">
              <button onClick={() => exportToCSV(filteredAndSorted)} className="btn-secondary px-3 flex items-center" title="Export as CSV">
                <FileText className="w-4 h-4" />
              </button>
              <button onClick={() => exportToJSON(filteredAndSorted)} className="btn-secondary px-3 flex items-center" title="Export as JSON">
                <FileJson className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-textMuted text-sm bg-surface-2 dark:bg-transparent">
                <th className="py-4 px-4 font-semibold tracking-wide">Date</th>
                <th className="py-4 px-4 font-semibold tracking-wide">Description</th>
                <th className="py-4 px-4 font-semibold tracking-wide">Category</th>
                <th className="py-4 px-4 font-semibold tracking-wide text-right">Amount</th>
                {role === 'Admin' && <th className="py-4 px-4 font-semibold tracking-wide text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map((t, i) => (
                  <tr key={t.id} className="border-b border-borderLight/60 hover:bg-black/5 dark:hover:bg-white/5 transition-colors fade-in group" style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="py-4 px-4 text-sm font-medium text-textMuted">{format(parseISO(t.date), 'MMM dd, yyyy')}</td>
                    <td className="py-4 px-4 font-semibold text-[15px] text-textMain">{t.description}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-surface-2 border border-border text-textMuted hover:text-textMain transition-colors shadow-sm">
                        {t.category}
                      </span>
                    </td>
                    <td className={cn(
                      "py-4 px-4 text-right font-bold tracking-tight text-[15px]",
                      t.type === 'Income' ? 'text-secondary' : 'text-accent'
                    )}>
                      {t.type === 'Income' ? '+ ' : '- '}₹{Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    {role === 'Admin' && (
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 text-textMuted hover:text-primary bg-surface border border-borderLight hover:border-primary/50 shadow-sm rounded-md min-w-[32px] flex items-center justify-center transition-all"
                            title="Edit Transaction"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="p-1.5 text-textMuted hover:text-white bg-surface border border-borderLight hover:bg-accent hover:border-accent shadow-sm rounded-md min-w-[32px] flex items-center justify-center transition-all"
                            title="Delete Transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'Admin' ? 5 : 4} className="py-8 text-center text-textMuted">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTransaction={editingTx}
      />
    </div>
  );
}
