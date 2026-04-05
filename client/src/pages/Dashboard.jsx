import { useMemo, useEffect } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

function SummaryCard({ title, amount, icon: Icon, trend, trendValue, type }) {
  return (
    <div className="glass-card p-6 flex flex-col relative overflow-hidden group card-enter">
      {/* Decorative gradient blob */}
      <div className={cn(
        "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity",
        type === 'income' ? 'bg-secondary' : type === 'expense' ? 'bg-accent' : 'bg-primary'
      )} />
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-surface-2 rounded-xl border border-borderLight shadow-sm">
          <Icon className={cn(
            "w-6 h-6",
            type === 'income' ? 'text-secondary' : type === 'expense' ? 'text-accent' : 'text-primary'
          )} />
        </div>
        <div className={cn(
          "flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full",
          trend === 'up' ? 'text-secondary bg-secondary/10' : 'text-accent bg-accent/10'
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>{trendValue}%</span>
        </div>
      </div>
      
      <div>
        <p className="text-textMuted text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-textMain tracking-tight">₹{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const transactions = useFinanceStore((state) => state.transactions);
  const fetchTransactions = useFinanceStore((state) => state.fetchTransactions);
  const isLoading = useFinanceStore((state) => state.isLoading);
  const theme = useFinanceStore((state) => state.theme);

  useEffect(() => {
    if (transactions.length === 0 && !isLoading) {
      fetchTransactions();
    }
  }, [transactions.length, fetchTransactions, isLoading]);

  const { totalIncome, totalExpense, balance, trends } = useMemo(() => {
    const raw = transactions.reduce((acc, curr) => {
      const amt = Number(curr.amount) || 0;
      if (curr.type === 'Income') acc.totalIncome += amt;
      if (curr.type === 'Expense') acc.totalExpense += amt;
      acc.balance = acc.totalIncome - acc.totalExpense;
      return acc;
    }, { totalIncome: 0, totalExpense: 0, balance: 0 });

    // Find the actual most recent date in the dataset to act as "Current Month"
    let maxDate = new Date(0);
    transactions.forEach(t => {
      const d = new Date(t.date);
      if (d > maxDate) maxDate = d;
    });

    const currentMonth = maxDate.getMonth();
    const currentYear = maxDate.getFullYear();

    let curInc = 0, prevInc = 0;
    let curExp = 0, prevExp = 0;

    transactions.forEach(t => {
      const d = new Date(t.date);
      const amt = Number(t.amount) || 0;
      
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        if (t.type === 'Income') curInc += amt;
        else curExp += amt;
      } else if (d.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1)) {
        if (t.type === 'Income') prevInc += amt;
        else prevExp += amt;
      }
    });

    const calcPerc = (cur, prev) => {
      if (prev === 0) return cur > 0 ? 100 : 0;
      return (((cur - prev) / prev) * 100);
    };

    const incPerc = calcPerc(curInc, prevInc);
    const expPerc = calcPerc(curExp, prevExp);
    const balPerc = calcPerc(curInc - curExp, prevInc - prevExp);

    return {
      ...raw,
      trends: {
        income: { val: Math.abs(incPerc).toFixed(1), dir: incPerc >= 0 ? "up" : "down" },
        expense: { val: Math.abs(expPerc).toFixed(1), dir: expPerc >= 0 ? "up" : "down" },
        balance: { val: Math.abs(balPerc).toFixed(1), dir: balPerc >= 0 ? "up" : "down" }
      }
    };
  }, [transactions]);

  // Transform data for Area Chart (Balance over time)
  const chartData = useMemo(() => {
    // Sort transactions by date
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningBalance = 0;
    const dataMap = {};

    sorted.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'Income') runningBalance += amt;
      else runningBalance -= amt;
      
      const dateStr = format(parseISO(t.date), 'MMM dd');
      dataMap[dateStr] = runningBalance;
    });

    return Object.entries(dataMap).map(([date, balance]) => ({ date, balance }));
  }, [transactions]);

  // Transform data for Pie Chart (Expenses by Category)
  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const categoryMap = {};
    expenses.forEach(t => {
      const amt = Number(t.amount) || 0;
      categoryMap[t.category] = (categoryMap[t.category] || 0) + amt;
    });
    
    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="space-y-6 pb-10 page-enter">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Balance" 
          amount={balance} 
          icon={DollarSign} 
          trend={trends.balance.dir} 
          trendValue={trends.balance.val} 
          type="balance" 
        />
        <SummaryCard 
          title="Total Income" 
          amount={totalIncome} 
          icon={ArrowUpRight} 
          trend={trends.income.dir} 
          trendValue={trends.income.val} 
          type="income" 
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={totalExpense} 
          icon={ArrowDownRight} 
          trend={trends.expense.dir} 
          trendValue={trends.expense.val} 
          type="expense" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Trend Area Chart */}
        <div className="glass-panel p-6 lg:col-span-2 flex flex-col h-96 card-enter" style={{ animationDelay: '240ms' }}>
          <h3 className="text-lg font-semibold text-textMain mb-6">Balance Trend</h3>
          <div className="flex-1 min-h-0">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} vertical={false} />
                  <XAxis dataKey="date" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', 
                      borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', 
                      borderRadius: '8px', 
                      color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                    }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-textMuted text-sm">
                No transaction data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Expenses by Category Pie Chart */}
        <div className="glass-panel p-6 flex flex-col h-96 card-enter" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-semibold text-textMain mb-6">Expense Breakdown</h3>
          <div className="flex-1 min-h-0">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', 
                      borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', 
                      borderRadius: '8px', 
                      color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                    }}
                    itemStyle={{ color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-textMuted text-sm">
                No expense data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
