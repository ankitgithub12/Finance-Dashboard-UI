import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { TrendingUp, Target, CreditCard, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function InsightCard({ title, value, description, icon: Icon, colorClass, delayMs }) {
  return (
    <div className="glass-card p-6 flex items-start space-x-4 card-enter" style={{ animationDelay: `${delayMs}ms` }}>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6 text-textMain" />
      </div>
      <div>
        <p className="text-sm font-medium text-textMuted mb-1">{title}</p>
        <h4 className="text-xl font-bold text-textMain mb-2">{value}</h4>
        <p className="text-xs text-textMuted">{description}</p>
      </div>
    </div>
  );
}

export default function Insights() {
  const transactions = useFinanceStore((state) => state.transactions);
  const theme = useFinanceStore((state) => state.theme);

  const { highestExpenseCategory, savingsRate, barData } = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const expenseCategories = {};
    const monthlyDataMap = {}; // Format: "YYYY-MM": { income, expense }

    transactions.forEach(t => {
      const amt = Number(t.amount);
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyDataMap[monthKey]) {
        monthlyDataMap[monthKey] = { name: monthKey, Income: 0, Expense: 0 };
      }

      if (t.type === 'Income') {
        totalIncome += amt;
        monthlyDataMap[monthKey].Income += amt;
      } else {
        totalExpense += amt;
        monthlyDataMap[monthKey].Expense += amt;
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + amt;
      }
    });

    let highestCat = 'N/A';
    let maxAmt = 0;
    for (const [cat, amt] of Object.entries(expenseCategories)) {
      if (amt > maxAmt) {
        maxAmt = amt;
        highestCat = cat;
      }
    }

    const rate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    // Sort bar data by month
    const sortedBarData = Object.values(monthlyDataMap).sort((a, b) => a.name.localeCompare(b.name)).map(item => {
      const dateParts = item.name.split('-');
      const formattedName = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1).toLocaleString('default', { month: 'short' });
      return { ...item, name: formattedName };
    });

    return {
      highestExpenseCategory: { name: highestCat, amount: maxAmt },
      savingsRate: rate.toFixed(1),
      barData: sortedBarData
    };
  }, [transactions]);

  return (
    <div className="space-y-6 page-enter">
      <h2 className="text-2xl font-bold text-textMain fade-in">Financial Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard
          title="Highest Spending"
          value={highestExpenseCategory.name}
          description={`₹${highestExpenseCategory.amount.toLocaleString()} spent`}
          icon={CreditCard}
          colorClass="bg-accent"
          delayMs={0}
        />
        <InsightCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          description="Of your total income is saved"
          icon={TrendingUp}
          colorClass="bg-secondary"
          delayMs={60}
        />
        <InsightCard
          title="Financial Health"
          value={Number(savingsRate) > 20 ? "Good" : "Needs Attention"}
          description="Based on 50/30/20 guidelines"
          icon={Target}
          colorClass="bg-primary"
          delayMs={120}
        />
        <InsightCard
          title="Upcoming Bills"
          value="2 Pending"
          description="Utilities and Subscription due soon"
          icon={AlertCircle}
          colorClass="bg-orange-500"
          delayMs={180}
        />
      </div>

      <div className="glass-panel p-6 mt-8 h-96 flex flex-col card-enter" style={{ animationDelay: '240ms' }}>
        <h3 className="text-lg font-semibold text-textMain mb-6">Income vs Expenses (Monthly)</h3>
        <div className="flex-1 min-h-0">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                    borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                  }}
                  cursor={{ fill: theme === 'dark' ? '#334155' : '#e2e8f0', opacity: theme === 'dark' ? 0.4 : 0.6 }}
                />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-textMuted text-sm">
              No monthly data available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
