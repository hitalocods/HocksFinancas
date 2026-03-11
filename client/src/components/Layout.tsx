import React from 'react';
import { useLocation } from 'wouter';
import { Home, FileText, BarChart3, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors cursor-pointer border-none bg-transparent ${
              isActive('/') 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Início</span>
          </button>

          <button
            onClick={() => navigate('/accounts')}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors cursor-pointer border-none bg-transparent ${
              isActive('/accounts') 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText size={24} />
            <span className="text-xs mt-1">Contas</span>
          </button>

          <button
            onClick={() => navigate('/transactions')}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors cursor-pointer border-none bg-transparent ${
              isActive('/transactions') 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 size={24} />
            <span className="text-xs mt-1">Gastos</span>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors cursor-pointer border-none bg-transparent ${
              isActive('/settings') 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings size={24} />
            <span className="text-xs mt-1">Config</span>
          </button>
        </div>
      </nav>

      {/* Top Navigation - Desktop */}
      <nav className="hidden md:block bg-card border-b border-border sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="font-bold text-xl text-primary cursor-pointer border-none bg-transparent"
            >
              Hocks Finanças
            </button>
            
            <div className="flex gap-6">
              <button
                onClick={() => navigate('/')}
                className={`flex items-center gap-2 transition-colors cursor-pointer border-none bg-transparent ${
                  isActive('/') 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Home size={20} />
                Início
              </button>

              <button
                onClick={() => navigate('/accounts')}
                className={`flex items-center gap-2 transition-colors cursor-pointer border-none bg-transparent ${
                  isActive('/accounts') 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText size={20} />
                Contas Fixas
              </button>

              <button
                onClick={() => navigate('/transactions')}
                className={`flex items-center gap-2 transition-colors cursor-pointer border-none bg-transparent ${
                  isActive('/transactions') 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BarChart3 size={20} />
                Ganhos e Gastos
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-none bg-transparent"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>
    </div>
  );
};
