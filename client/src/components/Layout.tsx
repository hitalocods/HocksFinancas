import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, FileText, BarChart3, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden">
        <div className="flex justify-around items-center h-16">
          <Link href="/">
            <a
              className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
                isActive('/') 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Home size={24} />
              <span className="text-xs mt-1">Início</span>
            </a>
          </Link>

          <Link href="/accounts">
            <a
              className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
                isActive('/accounts') 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText size={24} />
              <span className="text-xs mt-1">Contas</span>
            </a>
          </Link>

          <Link href="/transactions">
            <a
              className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
                isActive('/transactions') 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 size={24} />
              <span className="text-xs mt-1">Gastos</span>
            </a>
          </Link>

          <Link href="/settings">
            <a
              className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
                isActive('/settings') 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Settings size={24} />
              <span className="text-xs mt-1">Config</span>
            </a>
          </Link>
        </div>
      </nav>

      {/* Top Navigation - Desktop */}
      <nav className="hidden md:block bg-card border-b border-border sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="font-bold text-xl text-primary">Hocks Finanças</a>
            </Link>
            
            <div className="flex gap-6">
              <Link href="/">
                <a
                  className={`flex items-center gap-2 transition-colors ${
                    isActive('/') 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Home size={20} />
                  Início
                </a>
              </Link>

              <Link href="/accounts">
                <a
                  className={`flex items-center gap-2 transition-colors ${
                    isActive('/accounts') 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileText size={20} />
                  Contas Fixas
                </a>
              </Link>

              <Link href="/transactions">
                <a
                  className={`flex items-center gap-2 transition-colors ${
                    isActive('/transactions') 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <BarChart3 size={20} />
                  Ganhos e Gastos
                </a>
              </Link>
            </div>
          </div>

          <Link href="/settings">
            <a className="text-muted-foreground hover:text-foreground transition-colors">
              <Settings size={20} />
            </a>
          </Link>
        </div>
      </nav>
    </div>
  );
};
