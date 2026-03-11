import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/**
 * Design: Modern Minimalist with Warm Accents
 * - Warm color gradient for charts (amber → coral → teal)
 * - Clean transaction list with category icons
 * - Responsive charts for mobile and desktop
 */

const CHART_COLORS = ['#FCD34D', '#F59E0B', '#FB923C', '#FF6B6B', '#06B6D4'];

const categories = [
  { id: 'food', label: 'Alimentação' },
  { id: 'transport', label: 'Transporte' },
  { id: 'entertainment', label: 'Entretenimento' },
  { id: 'health', label: 'Saúde' },
  { id: 'shopping', label: 'Compras' },
  { id: 'bills', label: 'Contas' },
  { id: 'salary', label: 'Salário' },
  { id: 'other', label: 'Outro' },
];

export default function Transactions() {
  const { dailyTransactions, addDailyTransaction, deleteDailyTransaction, getMonthlyIncome, getMonthlyExpense } = useData();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense' as const,
    amount: '',
    description: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.description) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    addDailyTransaction({
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
    });

    toast.success('Transação adicionada com sucesso!');
    setFormData({
      type: 'expense',
      amount: '',
      description: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
    });
    setOpen(false);
  };

  // Prepare chart data
  const getDailyChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayTransactions = dailyTransactions.filter(t => t.date === date);
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
        income,
        expense,
      };
    });
  };

  const getCategoryChartData = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const categoryTotals: Record<string, number> = {};

    dailyTransactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: categories.find(c => c.id === category)?.label || category,
      value: amount,
    }));
  };

  const monthlyIncome = getMonthlyIncome();
  const monthlyExpense = getMonthlyExpense();
  const balance = monthlyIncome - monthlyExpense;

  const getCategoryLabel = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.label || categoryId;
  };

  const sortedTransactions = [...dailyTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const dailyChartData = getDailyChartData();
  const categoryChartData = getCategoryChartData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-border py-8 px-4 md:px-0">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="display-medium text-foreground mb-2">Ganhos e Gastos</h1>
              <p className="text-muted-foreground">Acompanhe suas transações diárias com gráficos intuitivos</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-amber-600 text-white gap-2">
                  <Plus size={20} />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Transação</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="type">Tipo *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                      <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Ganho</SelectItem>
                        <SelectItem value="expense">Gasto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Valor (R$) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição *</Label>
                    <Input
                      id="description"
                      placeholder="Ex: Almoço, Uber, Salário"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-amber-600 text-white">
                    Adicionar Transação
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 px-4 md:px-0">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Ganhos do Mês</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {monthlyIncome.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Gastos do Mês</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {monthlyExpense.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingDown className="text-red-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className={`p-6 border-border ${balance >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Saldo</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {balance.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart - Last 7 Days */}
          <Card className="p-6 border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">Últimos 7 Dias</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.75rem',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Ganhos"
                  dot={{ fill: '#10B981', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Gastos"
                  dot={{ fill: '#EF4444', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart - Categories */}
          {categoryChartData.length > 0 && (
            <Card className="p-6 border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">Gastos por Categoria</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: R$ ${value.toFixed(0)}`}
                    outerRadius={80}
                    fill="#F59E0B"
                    dataKey="value"
                  >
                    {categoryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${(value as number).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        {/* Transactions List */}
        <Card className="p-6 border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Transações Recentes</h2>
          {sortedTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma transação registrada. Comece adicionando suas ganhos e gastos!
            </p>
          ) : (
            <div className="space-y-2">
              {sortedTransactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-muted transition-colors border border-border"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-3 rounded-lg ${
                        transaction.type === 'income'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp
                          className="text-green-600"
                          size={20}
                        />
                      ) : (
                        <TrendingDown
                          className="text-red-600"
                          size={20}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getCategoryLabel(transaction.category)} •{' '}
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p
                      className={`text-lg font-bold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'} R${' '}
                      {transaction.amount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        deleteDailyTransaction(transaction.id);
                        toast.success('Transação removida');
                      }}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
