import React, { createContext, useContext, useState, useCallback } from 'react';

export interface FixedAccount {
  id: string;
  name: string;
  value: number;
  dueDay: number;
  totalParcels: number;
  currentParcel: number;
  startDate: string;
  category: 'utilities' | 'subscription' | 'loan' | 'insurance' | 'other';
  createdAt: string;
}

export interface Parcel {
  id: string;
  accountId: string;
  accountName: string;
  value: number;
  dueDate: string;
  parcelNumber: number;
  totalParcels: number;
  paid: boolean;
  paidDate?: string;
}

export interface DailyTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

interface DataContextType {
  // Fixed Accounts
  fixedAccounts: FixedAccount[];
  addFixedAccount: (account: Omit<FixedAccount, 'id' | 'createdAt'>) => void;
  updateFixedAccount: (id: string, account: Partial<FixedAccount>) => void;
  deleteFixedAccount: (id: string) => void;
  
  // Parcels
  parcels: Parcel[];
  generateParcels: (accountId: string, account: FixedAccount) => void;
  markParcelAsPaid: (parcelId: string) => void;
  
  // Daily Transactions
  dailyTransactions: DailyTransaction[];
  addDailyTransaction: (transaction: Omit<DailyTransaction, 'id' | 'createdAt'>) => void;
  deleteDailyTransaction: (id: string) => void;
  
  // Calculations
  getTotalMonthlyExpense: () => number;
  getTodayTransactions: () => DailyTransaction[];
  getMonthlyIncome: () => number;
  getMonthlyExpense: () => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fixedAccounts, setFixedAccounts] = useState<FixedAccount[]>([]);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [dailyTransactions, setDailyTransactions] = useState<DailyTransaction[]>([]);

  const addFixedAccount = useCallback((account: Omit<FixedAccount, 'id' | 'createdAt'>) => {
    const newAccount: FixedAccount = {
      ...account,
      id: `account-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setFixedAccounts(prev => [...prev, newAccount]);
    
    // Generate parcels for this account
    generateParcels(newAccount.id, newAccount);
  }, []);

  const updateFixedAccount = useCallback((id: string, updates: Partial<FixedAccount>) => {
    setFixedAccounts(prev =>
      prev.map(account =>
        account.id === id ? { ...account, ...updates } : account
      )
    );
  }, []);

  const deleteFixedAccount = useCallback((id: string) => {
    setFixedAccounts(prev => prev.filter(account => account.id !== id));
    setParcels(prev => prev.filter(parcel => parcel.accountId !== id));
  }, []);

  const generateParcels = useCallback((accountId: string, account: FixedAccount) => {
    const startDate = new Date(account.startDate);
    const newParcels: Parcel[] = [];

    for (let i = 1; i <= account.totalParcels; i++) {
      const parcelDate = new Date(startDate);
      parcelDate.setMonth(parcelDate.getMonth() + (i - 1));
      parcelDate.setDate(account.dueDay);

      newParcels.push({
        id: `parcel-${accountId}-${i}`,
        accountId,
        accountName: account.name,
        value: account.value,
        dueDate: parcelDate.toISOString().split('T')[0],
        parcelNumber: i,
        totalParcels: account.totalParcels,
        paid: false,
      });
    }

    setParcels(prev => [...prev.filter(p => p.accountId !== accountId), ...newParcels]);
  }, []);

  const markParcelAsPaid = useCallback((parcelId: string) => {
    setParcels(prev =>
      prev.map(parcel =>
        parcel.id === parcelId
          ? { ...parcel, paid: true, paidDate: new Date().toISOString() }
          : parcel
      )
    );
  }, []);

  const addDailyTransaction = useCallback((transaction: Omit<DailyTransaction, 'id' | 'createdAt'>) => {
    const newTransaction: DailyTransaction = {
      ...transaction,
      id: `transaction-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDailyTransactions(prev => [...prev, newTransaction]);
  }, []);

  const deleteDailyTransaction = useCallback((id: string) => {
    setDailyTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const getTodayTransactions = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return dailyTransactions.filter(t => t.date === today);
  }, [dailyTransactions]);

  const getTotalMonthlyExpense = useCallback(() => {
    return parcels
      .filter(p => !p.paid)
      .reduce((sum, p) => sum + p.value, 0);
  }, [parcels]);

  const getMonthlyIncome = useCallback(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return dailyTransactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [dailyTransactions]);

  const getMonthlyExpense = useCallback(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return dailyTransactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [dailyTransactions]);

  const value: DataContextType = {
    fixedAccounts,
    addFixedAccount,
    updateFixedAccount,
    deleteFixedAccount,
    parcels,
    generateParcels,
    markParcelAsPaid,
    dailyTransactions,
    addDailyTransaction,
    deleteDailyTransaction,
    getTotalMonthlyExpense,
    getTodayTransactions,
    getMonthlyIncome,
    getMonthlyExpense,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
