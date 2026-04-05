/**
 * Mock API Service — simulates real network calls with artificial delay.
 * Swap these out with real axios calls when the backend is ready.
 */

import { initialTransactions } from './mockData';

const DELAY = 400; // ms

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// In-memory store (mirrors the localStorage-persisted Zustand state)
let _transactions = [...initialTransactions];

export const mockAPI = {
  // GET /transactions
  fetchTransactions: async () => {
    await delay(DELAY);
    return { data: [..._transactions], success: true };
  },

  // POST /transactions
  createTransaction: async (payload) => {
    await delay(DELAY);
    const newTx = { ...payload, id: Date.now().toString() };
    _transactions = [newTx, ..._transactions];
    return { data: newTx, success: true };
  },

  // PUT /transactions/:id
  updateTransaction: async (payload) => {
    await delay(DELAY);
    _transactions = _transactions.map((t) =>
      t.id === payload.id ? payload : t
    );
    return { data: payload, success: true };
  },

  // DELETE /transactions/:id
  deleteTransaction: async (id) => {
    await delay(DELAY);
    _transactions = _transactions.filter((t) => t.id !== id);
    return { success: true };
  },

  // GET /summary
  fetchSummary: async () => {
    await delay(DELAY / 2);
    const income = _transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = _transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return {
      data: { totalIncome: income, totalExpense: expense, balance: income - expense },
      success: true,
    };
  },
};
