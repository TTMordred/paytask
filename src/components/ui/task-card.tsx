import { Clock, DollarSign, User, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task, getUserById } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onAction?: (task: Task) => void;
  actionLabel?: string;
  showClient?: boolean;
}

export const TaskCard = ({ task, onAction, actionLabel = "View Details", showClient = true }: TaskCardProps) => {
  const client = getUserById(task.clientId);
  const worker = task.workerId ? getUserById(task.workerId) : null;

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'published': return 'bg-primary text-primary-foreground';
      case 'in_progress': return 'bg-warning text-warning-foreground';
      case 'submitted': return 'bg-accent text-accent-foreground';
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: Task['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-success/10 text-success border-success/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'hard': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 border border-border/50 bg-gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground mb-2 line-clamp-2">
              {task.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {task.description}
            </p>
          </div>
          <Badge className={getStatusColor(task.status)} variant="secondary">
            {task.status.replace('_', ' ')}
          </Badge>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            <Tag className="w-3 h-3 mr-1" />
            {task.category}
          </Badge>
          <Badge variant="outline" className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
            {task.difficulty}
          </Badge>
          {task.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {task.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{task.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-success" />
            <span className="font-bold text-lg text-success">${task.reward}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
            </span>
          </div>
        </div>

        {showClient && client && (
          <div className="flex items-center space-x-2 mb-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback>
                <User className="w-3 h-3" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{client.name}</span>
            <span className="text-xs text-muted-foreground">
              ⭐ {client.reputation.toFixed(1)}
            </span>
          </div>
        )}

        {worker && (
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xs text-muted-foreground">Worker:</span>
            <Avatar className="w-6 h-6">
              <AvatarImage src={worker.avatar} alt={worker.name} />
              <AvatarFallback>
                <User className="w-3 h-3" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{worker.name}</span>
            <span className="text-xs text-muted-foreground">
              ⭐ {worker.reputation.toFixed(1)}
            </span>
          </div>
        )}

        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Posted {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button 
          className="w-full" 
          onClick={() => onAction?.(task)}
          variant={task.status === 'published' ? 'default' : 'outline'}
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};