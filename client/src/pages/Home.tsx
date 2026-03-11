import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

/**
 * Design: Modern Minimalist with Warm Accents
 * - Hero section with warm amber gradient background
 * - Clean card layout with ample whitespace
 * - Warm color palette for positive financial messaging
 */

export default function Home() {
  const { 
    fixedAccounts, 
    parcels, 
    dailyTransactions,
    getTotalMonthlyExpense,
    getMonthlyIncome,
    getMonthlyExpense,
  } = useData();

  const totalMonthlyFixed = getTotalMonthlyExpense();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpense = getMonthlyExpense();
  const balance = monthlyIncome - monthlyExpense - totalMonthlyFixed;

  const upcomingParcels = parcels
    .filter(p => !p.paid)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const todayDate = new Date().toISOString().split('T')[0];
  const todayTransactions = dailyTransactions.filter(t => t.date === todayDate);
  const todayIncome = todayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const todayExpense = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 pt-8 pb-12 px-4 md:px-0 overflow-hidden"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663407051874/CH2ZQQKCnxdC9GFqHb3YUu/hero-dashboard-BG42n2XgQcd3WTZQATiBQ8.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-transparent to-background/50"></div>
        
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <h1 className="display-large text-foreground mb-3">
              Bem-vindo ao Hocks Finanças
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Gerencie suas contas fixas e acompanhe seus ganhos e gastos diários com clareza.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/accounts">
                <Button className="bg-primary hover:bg-amber-600 text-white">
                  Gerenciar Contas Fixas
                </Button>
              </Link>
              <Link href="/transactions">
                <Button variant="outline" className="border-primary text-primary hover:bg-amber-50">
                  Ver Ganhos e Gastos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="container py-8 px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Monthly Income */}
          <Card className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Ganhos do Mês</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {monthlyIncome.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          {/* Monthly Expense */}
          <Card className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Gastos Diários</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {monthlyExpense.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingDown className="text-red-600" size={24} />
              </div>
            </div>
          </Card>

          {/* Fixed Accounts */}
          <Card className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Contas Fixas</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalMonthlyFixed.toFixed(2)}
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Calendar className="text-amber-600" size={24} />
              </div>
            </div>
          </Card>

          {/* Balance */}
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

        {/* Today's Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-border lg:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-4">Resumo de Hoje</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Ganhos</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {todayIncome.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Gastos</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {todayExpense.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {todayTransactions.length} transações registradas
            </p>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6 border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Estatísticas</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Contas Fixas</p>
                <p className="text-lg font-semibold text-foreground">{fixedAccounts.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parcelas Pendentes</p>
                <p className="text-lg font-semibold text-foreground">
                  {parcels.filter(p => !p.paid).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Parcels */}
        {upcomingParcels.length > 0 && (
          <Card className="p-6 border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Próximas Parcelas</h2>
            <div className="space-y-3">
              {upcomingParcels.map(parcel => (
                <div key={parcel.id} className="flex items-center justify-between pb-3 border-b border-border last:border-b-0">
                  <div>
                    <p className="font-semibold text-foreground">{parcel.accountName}</p>
                    <p className="text-sm text-muted-foreground">
                      Parcela {parcel.parcelNumber}/{parcel.totalParcels}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">R$ {parcel.value.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(parcel.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/accounts">
              <Button variant="outline" className="w-full mt-4">
                Ver Todas as Parcelas
              </Button>
            </Link>
          </Card>
        )}

        {/* Empty State */}
        {fixedAccounts.length === 0 && (
          <Card className="p-12 border-border text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Comece a Organizar suas Finanças</h3>
            <p className="text-muted-foreground mb-6">
              Adicione suas contas fixas para começar a acompanhar suas parcelas automaticamente.
            </p>
            <Link href="/accounts">
              <Button className="bg-primary hover:bg-amber-600 text-white">
                Adicionar Primeira Conta
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
