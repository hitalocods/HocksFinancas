import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData, FixedAccount } from '@/contexts/DataContext';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Design: Modern Minimalist with Warm Accents
 * - Clean form inputs with warm accent focus states
 * - Card-based layout for each account
 * - Automatic parcel generation with visual feedback
 */

export default function Accounts() {
  const { fixedAccounts, addFixedAccount, deleteFixedAccount, parcels, markParcelAsPaid } = useData();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    dueDay: '1',
    totalParcels: '12',
    startDate: new Date().toISOString().split('T')[0],
    category: 'utilities' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.value) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    addFixedAccount({
      name: formData.name,
      value: parseFloat(formData.value),
      dueDay: parseInt(formData.dueDay),
      totalParcels: parseInt(formData.totalParcels),
      startDate: formData.startDate,
      category: formData.category,
      currentParcel: 1,
    });

    toast.success(`Conta "${formData.name}" criada com sucesso!`);
    setFormData({
      name: '',
      value: '',
      dueDay: '1',
      totalParcels: '12',
      startDate: new Date().toISOString().split('T')[0],
      category: 'utilities',
    });
    setOpen(false);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      utilities: 'Utilidades',
      subscription: 'Assinatura',
      loan: 'Empréstimo',
      insurance: 'Seguro',
      other: 'Outro',
    };
    return labels[category] || category;
  };

  const getAccountParcels = (accountId: string) => {
    return parcels.filter(p => p.accountId === accountId);
  };

  const getPaidParcelsCount = (accountId: string) => {
    return getAccountParcels(accountId).filter(p => p.paid).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-border py-8 px-4 md:px-0">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="display-medium text-foreground mb-2">Contas Fixas</h1>
              <p className="text-muted-foreground">Gerencie suas contas com parcelas automáticas</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-amber-600 text-white gap-2">
                  <Plus size={20} />
                  Nova Conta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Conta Fixa</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Conta *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Netflix, Aluguel, Seguro"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="value">Valor (R$) *</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dueDay">Dia do Vencimento</Label>
                      <Input
                        id="dueDay"
                        type="number"
                        min="1"
                        max="31"
                        value={formData.dueDay}
                        onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                        className="border-border focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalParcels">Total de Parcelas</Label>
                      <Input
                        id="totalParcels"
                        type="number"
                        min="1"
                        value={formData.totalParcels}
                        onChange={(e) => setFormData({ ...formData, totalParcels: e.target.value })}
                        className="border-border focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as any })}>
                      <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utilities">Utilidades</SelectItem>
                        <SelectItem value="subscription">Assinatura</SelectItem>
                        <SelectItem value="loan">Empréstimo</SelectItem>
                        <SelectItem value="insurance">Seguro</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-amber-600 text-white">
                    Criar Conta
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 px-4 md:px-0">
        {fixedAccounts.length === 0 ? (
          <Card className="p-12 border-border text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Nenhuma conta criada</h3>
            <p className="text-muted-foreground mb-6">
              Crie sua primeira conta fixa para começar a gerenciar suas parcelas automaticamente.
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-amber-600 text-white gap-2">
                  <Plus size={20} />
                  Criar Primeira Conta
                </Button>
              </DialogTrigger>
            </Dialog>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fixedAccounts.map(account => {
              const accountParcels = getAccountParcels(account.id);
              const paidCount = getPaidParcelsCount(account.id);
              const progress = (paidCount / account.totalParcels) * 100;

              return (
                <Card key={account.id} className="p-6 border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{account.name}</h3>
                      <p className="text-sm text-muted-foreground">{getCategoryLabel(account.category)}</p>
                    </div>
                    <button
                      onClick={() => {
                        deleteFixedAccount(account.id);
                        toast.success('Conta removida');
                      }}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-3xl font-bold text-primary mb-2">
                      R$ {account.value.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: dia {account.dueDay}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-foreground">
                        Progresso: {paidCount}/{account.totalParcels}
                      </p>
                      <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Parcels List */}
                  <div className="space-y-2 mb-4">
                    {accountParcels.slice(0, 3).map(parcel => (
                      <button
                        key={parcel.id}
                        onClick={() => {
                          if (!parcel.paid) {
                            markParcelAsPaid(parcel.id);
                            toast.success('Parcela marcada como paga');
                          }
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          parcel.paid
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-secondary hover:bg-muted border border-border'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <CheckCircle2
                            size={18}
                            className={parcel.paid ? 'text-green-600' : 'text-muted-foreground'}
                          />
                          <div className="text-left">
                            <p className="text-sm font-semibold text-foreground">
                              Parcela {parcel.parcelNumber}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(parcel.dueDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <p className={`text-sm font-semibold ${
                          parcel.paid ? 'text-green-600' : 'text-foreground'
                        }`}>
                          R$ {parcel.value.toFixed(2)}
                        </p>
                      </button>
                    ))}
                    {accountParcels.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        +{accountParcels.length - 3} parcelas
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
