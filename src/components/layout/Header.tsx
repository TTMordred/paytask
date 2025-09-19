import { Bell, Search, User, Wallet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { currentUser } from '@/lib/mockData';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="border-b bg-gradient-card shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PT</span>
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              PayTask
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button 
              variant={location.pathname === '/browse' ? 'default' : 'ghost'}
              onClick={() => navigate('/browse')}
            >
              Browse Tasks
            </Button>
            <Button 
              variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              variant={location.pathname === '/earnings' ? 'default' : 'ghost'}
              onClick={() => navigate('/earnings')}
            >
              Earnings
            </Button>
          </nav>

          {/* Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search tasks..." 
                className="pl-10"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              size="sm" 
              className="bg-gradient-primary shadow-primary"
              onClick={() => navigate('/create-task')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>

            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-sm">$1,250</span>
            </div>

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-destructive" />
            </Button>

            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">
                  ⭐ {currentUser.reputation.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};