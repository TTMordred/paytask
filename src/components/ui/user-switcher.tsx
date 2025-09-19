import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, User as UserIcon, Star, Briefcase, UserCheck } from 'lucide-react';
import { currentUser, mockUsers, setCurrentUser, type User } from '@/lib/mockData';

interface UserSwitcherProps {
  onUserChange?: (user: User) => void;
}

export const UserSwitcher = ({ onUserChange }: UserSwitcherProps) => {
  const [selectedUser, setSelectedUser] = useState(currentUser);

  const handleUserSwitch = (user: User) => {
    setSelectedUser(user);
    setCurrentUser(user);
    if (onUserChange) {
      onUserChange(user);
    }
    // Reload page to reflect user change
    window.location.reload();
  };

  const getRoleIcon = (role: string) => {
    return role === 'client' ? <Briefcase className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />;
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'client' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  };

  const getRoleText = (role: string) => {
    return role === 'client' ? 'Client' : 'Worker';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
            <AvatarFallback>
              <UserIcon className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium">{selectedUser.name}</p>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-muted-foreground">
                {selectedUser.reputation.toFixed(1)}
              </span>
              <Badge className={`text-xs px-1 py-0 ${getRoleBadgeColor(selectedUser.role)}`}>
                {getRoleText(selectedUser.role)}
              </Badge>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Switch User</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {mockUsers.map((user) => (
          <DropdownMenuItem
            key={user.id}
            onClick={() => handleUserSwitch(user)}
            className={`p-3 cursor-pointer ${
              selectedUser.id === user.id ? 'bg-muted' : ''
            }`}
          >
            <div className="flex items-center space-x-3 w-full">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  {selectedUser.id === user.id && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    {getRoleIcon(user.role)}
                    <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {user.reputation.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                  <span>Total: {user.totalTasks}</span>
                  <span>Completed: {user.completedTasks}</span>
                  {user.earnings && (
                    <span>Earnings: ${user.earnings.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          Demo: Select user to switch role and data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
