import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="text-red-600" size={48} />
          </div>
        </div>
        <h1 className="display-medium text-foreground mb-2">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">
          Desculpe, a página que você está procurando não existe.
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-amber-600 text-white">
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
}
