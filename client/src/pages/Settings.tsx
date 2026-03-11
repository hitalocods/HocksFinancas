import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Info } from 'lucide-react';

/**
 * Design: Modern Minimalist with Warm Accents
 * - Clean settings interface with organized sections
 * - Informational cards with helpful tips
 */

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-border py-8 px-4 md:px-0">
        <div className="container">
          <div className="flex items-center gap-3">
            <SettingsIcon size={32} className="text-primary" />
            <div>
              <h1 className="display-medium text-foreground">Configurações</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 px-4 md:px-0">
        <div className="max-w-2xl space-y-6">
          {/* About Section */}
          <Card className="p-6 border-border">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Info className="text-amber-600" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground mb-2">Sobre o Hocks Finanças</h2>
                <p className="text-muted-foreground mb-4">
                  Hocks Finanças é um aplicativo de gestão financeira pessoal desenvolvido para ajudá-lo a
                  controlar suas contas fixas com parcelas automáticas e acompanhar seus ganhos e gastos diários.
                </p>
                <p className="text-sm text-muted-foreground">
                  Versão 1.0.0
                </p>
              </div>
            </div>
          </Card>

          {/* Features Section */}
          <Card className="p-6 border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">Recursos Principais</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-primary font-bold mt-1">✓</div>
                <div>
                  <p className="font-semibold text-foreground">Contas Fixas com Parcelas Automáticas</p>
                  <p className="text-sm text-muted-foreground">
                    Crie contas fixas e o sistema gera automaticamente todas as parcelas mensais.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-primary font-bold mt-1">✓</div>
                <div>
                  <p className="font-semibold text-foreground">Rastreamento de Ganhos e Gastos</p>
                  <p className="text-sm text-muted-foreground">
                    Registre suas transações diárias com categorias personalizadas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-primary font-bold mt-1">✓</div>
                <div>
                  <p className="font-semibold text-foreground">Gráficos Intuitivos</p>
                  <p className="text-sm text-muted-foreground">
                    Visualize seus dados com gráficos de linha, barra e pizza.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-primary font-bold mt-1">✓</div>
                <div>
                  <p className="font-semibold text-foreground">Design Responsivo</p>
                  <p className="text-sm text-muted-foreground">
                    Funciona perfeitamente em celulares, tablets e computadores.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips Section */}
          <Card className="p-6 border-border bg-amber-50">
            <h2 className="text-lg font-bold text-foreground mb-4">Dicas de Uso</h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-foreground mb-1">Organizando Contas Fixas</p>
                <p className="text-sm text-muted-foreground">
                  Use categorias para organizar suas contas (Utilidades, Assinaturas, Empréstimos, etc).
                  Isso facilita o acompanhamento e análise de gastos.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Registrando Transações</p>
                <p className="text-sm text-muted-foreground">
                  Registre suas transações diárias de ganhos e gastos com descrições claras e categorias
                  apropriadas para melhor análise.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Marcando Parcelas como Pagas</p>
                <p className="text-sm text-muted-foreground">
                  Clique nas parcelas na tela de Contas Fixas para marcá-las como pagas e acompanhar
                  o progresso do pagamento.
                </p>
              </div>
            </div>
          </Card>

          {/* Data Section */}
          <Card className="p-6 border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">Dados</h2>
            <p className="text-muted-foreground mb-4">
              Todos os seus dados são armazenados localmente no seu navegador. Nenhuma informação é enviada
              para servidores externos.
            </p>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-secondary"
              onClick={() => {
                const data = {
                  exportDate: new Date().toISOString(),
                  note: 'Dados exportados do Hocks Finanças',
                };
                const dataStr = JSON.stringify(data, null, 2);
                const element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr));
                element.setAttribute('download', `hocks-financas-backup-${new Date().toISOString().split('T')[0]}.json`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              Fazer Backup dos Dados
            </Button>
          </Card>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Desenvolvido com ❤️ para ajudar você a organizar suas finanças
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
