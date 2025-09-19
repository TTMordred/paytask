import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/ui/task-card';
import { Header } from '@/components/layout/Header';
import { Plus, TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { currentUser, getTasksByUserId, Task } from '@/lib/mockData'; // Import Task interface
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const userTasks = getTasksByUserId(currentUser.id, currentUser.role);
  const activeTasks = userTasks.filter(task => ['published', 'in_progress'].includes(task.status));
  const completedTasks = userTasks.filter(task => task.status === 'approved');
  const pendingTasks = userTasks.filter(task => task.status === 'submitted');

  const stats = [
    {
      title: 'Active Tasks',
      value: activeTasks.length,
      icon: Clock,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Spent',
      value: `$${userTasks.reduce((sum, task) => sum + task.reward, 0)}`,
      icon: DollarSign,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Success Rate',
      value: `${Math.round((completedTasks.length / Math.max(userTasks.length, 1)) * 100)}%`,
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  const handleTaskAction = (task: Task) => { // Use Task interface
    if (currentUser.role === 'client') {
      navigate(`/task/${task.id}`); // Client manages their own tasks
    } else if (currentUser.role === 'worker') {
      if (task.status === 'published') {
        navigate(`/browse/${task.id}`); // Worker applies for published tasks
      } else {
        navigate(`/task/${task.id}`); // Worker views details of accepted/submitted tasks
      }
    }
  };

  const getTaskCardActionLabel = (task: Task) => {
    if (currentUser.role === 'client') {
      return 'Manage Task';
    } else if (currentUser.role === 'worker') {
      if (task.status === 'published') {
        return 'Apply Now';
      } else {
        return 'View Details';
      }
    }
    return 'View Details'; // Default
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your tasks and track your progress
            </p>
          </div>
          {currentUser.role === 'client' && ( // Only show "Create New Task" for clients
            <Button 
              size="lg" 
              className="bg-gradient-primary shadow-primary"
              onClick={() => navigate('/create-task')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Task
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-gradient-card border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Task Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full lg:w-fit grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeTasks.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending Review ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Recent Active Tasks</span>
                  </CardTitle>
                  <CardDescription>
                    Your most recently created tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <p className="text-xs text-muted-foreground">${task.reward} • {task.category}</p>
                      </div>
                      <Badge className={task.status === 'published' ? 'bg-primary' : 'bg-warning'}>
                        {task.status === 'published' ? 'Open' : 'In Progress'}
                      </Badge>
                    </div>
                  ))}
                  {activeTasks.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      No active tasks. Create your first task to get started!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>Recent Completions</span>
                  </CardTitle>
                  <CardDescription>
                    Your recently completed tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {completedTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <p className="text-xs text-muted-foreground">${task.reward} • {task.category}</p>
                      </div>
                      <Badge className="bg-success">
                        Completed
                      </Badge>
                    </div>
                  ))}
                  {completedTasks.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      No completed tasks yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAction={handleTaskAction}
                  actionLabel={getTaskCardActionLabel(task)}
                  showClient={false}
                />
              ))}
            </div>
            {activeTasks.length === 0 && (
              <Card className="bg-gradient-card">
                <CardContent className="py-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Tasks</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first task to start finding talented workers.
                  </p>
                  <Button onClick={() => navigate('/create-task')}>
                    Create Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAction={handleTaskAction}
                  actionLabel={getTaskCardActionLabel(task)}
                  showClient={false}
                />
              ))}
            </div>
            {pendingTasks.length === 0 && (
              <Card className="bg-gradient-card">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Reviews</h3>
                  <p className="text-muted-foreground">
                    All caught up! No submissions waiting for your review.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAction={handleTaskAction}
                  actionLabel={getTaskCardActionLabel(task)}
                  showClient={false}
                />
              ))}
            </div>
            {completedTasks.length === 0 && (
              <Card className="bg-gradient-card">
                <CardContent className="py-12 text-center">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Tasks</h3>
                  <p className="text-muted-foreground">
                    Complete your first task to see it here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
