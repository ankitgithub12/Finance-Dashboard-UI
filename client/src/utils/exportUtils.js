/**
 * Export utilities — CSV and JSON download helpers
 */

/**
 * Download transactions as CSV
 * @param {Array} transactions
 * @param {string} filename
 */
export const exportToCSV = (transactions, filename = 'transactions') => {
  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount'];

  const rows = transactions.map((t) => [
    t.id,
    t.date,
    `"${t.description.replace(/"/g, '""')}"`, // escape quotes
    t.category,
    t.type,
    t.amount,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `${filename}_${dateStamp()}.csv`);
};

/**
 * Download transactions as JSON
 * @param {Array} transactions
 * @param {string} filename
 */
export const exportToJSON = (transactions, filename = 'transactions') => {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  triggerDownload(blob, `${filename}_${dateStamp()}.json`);
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const dateStamp = () => new Date().toISOString().split('T')[0];
