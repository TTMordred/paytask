import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  DollarSign, 
  User as UserIcon, 
  Clock, 
  Tag, 
  FileText, 
  Star,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { 
  getTaskById,
  getUserById, 
  currentUser, 
  updateTaskStatus,
  addPayment,
  type Task,
  type User
} from '@/lib/mockData';

const BrowseTaskDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [client, setClient] = useState<User | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (id) {
      const foundTask = getTaskById(id);
      if (foundTask) {
        setTask(foundTask);
        const taskClient = getUserById(foundTask.clientId);
        setClient(taskClient || null);
      }
    }
  }, [id]);

  const handleApplyForTask = async () => {
    if (!task || !id) return;
    
    setIsApplying(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update task status to in_progress and assign current user as worker
      updateTaskStatus(id, 'in_progress', currentUser.id);
      
      // Update local state
      setTask(prev => prev ? { ...prev, status: 'in_progress', workerId: currentUser.id } : null);
      
      toast({
        title: "Application Successful!",
        description: "You have successfully applied for this task. You can start working and submit when completed.",
      });
      
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "There was an error applying for this task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in_progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'submitted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <AlertCircle className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Task Not Found
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Task with ID "{id}" does not exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/browse')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse Tasks
          </Button>
        </main>
      </div>
    );
  }

  const canApply = task.status === 'published' && 
                   currentUser.role === 'worker' && 
                   task.clientId !== currentUser.id;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/browse')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse Tasks
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {task.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status === 'published' ? 'Open' : 
                         task.status === 'in_progress' ? 'In Progress' :
                         task.status === 'submitted' ? 'Submitted' :
                         task.status === 'approved' ? 'Approved' :
                         task.status === 'rejected' ? 'Rejected' : task.status}
                      </Badge>
                      <Badge className={getDifficultyColor(task.difficulty)}>
                        {task.difficulty === 'easy' ? 'Easy' :
                         task.difficulty === 'medium' ? 'Medium' :
                         task.difficulty === 'hard' ? 'Hard' : task.difficulty}
                      </Badge>
                      <Badge variant="outline">{task.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-2xl font-bold text-green-600">
                      <DollarSign className="w-6 h-6 mr-1" />
                      ${task.reward.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Task Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  {task.submissionNotes && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submission Notes
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {task.submissionNotes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Deadline: {formatDate(task.deadline)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Created: {formatDate(task.createdAt)}
                    </div>
                    {task.submittedAt && (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Submitted: {formatDate(task.submittedAt)}
                      </div>
                    )}
                  </div>

                  {task.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 flex items-center">
                        <Tag className="w-4 h-4 mr-2" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.attachments && task.attachments.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Attachments
                      </h3>
                      <div className="space-y-2">
                        {task.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                            <FileText className="w-4 h-4 mr-2" />
                            {attachment}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Information */}
            {client && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <UserIcon className="w-5 h-5 mr-2" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={client.avatar} alt={client.name} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-semibold">{client.reputation.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Tasks</span>
                      <span className="font-semibold">{client.totalTasks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="font-semibold">{client.completedTasks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Joined</span>
                      <span className="font-semibold">{formatDate(client.joinedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Task Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reward</span>
                    <span className="font-bold text-green-600 text-lg">
                      ${task.reward.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Deadline</span>
                    <span className="font-semibold">
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Difficulty</span>
                    <Badge className={getDifficultyColor(task.difficulty)}>
                      {task.difficulty === 'easy' ? 'Easy' :
                       task.difficulty === 'medium' ? 'Medium' :
                       task.difficulty === 'hard' ? 'Hard' : task.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            {canApply && (
              <Card>
                <CardContent className="pt-6">
                  <Button 
                    onClick={handleApplyForTask}
                    disabled={isApplying}
                    className="w-full"
                    size="lg"
                  >
                    {isApplying ? 'Applying...' : 'Apply Now'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    You will be assigned this task if your application is successful
                  </p>
                </CardContent>
              </Card>
            )}

            {task.status === 'in_progress' && task.workerId === currentUser.id && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <div>
                      <p className="font-bold text-green-700 text-lg">
                        Application Successful!
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        You have been assigned this task
                      </p>
                    </div>
                    <div className="space-y-2 w-full">
                      <Button 
                        onClick={() => navigate(`/task/${task.id}`)}
                        className="w-full"
                        size="lg"
                      >
                        Start Working & Submit
                      </Button>
                      <Button 
                        onClick={() => navigate('/browse')}
                        variant="outline"
                        className="w-full"
                      >
                        Continue Browsing Tasks
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You can start working now or continue looking for other tasks
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {(task.status === 'submitted' || task.status === 'approved' || task.status === 'rejected') && task.workerId === currentUser.id && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-blue-500 mx-auto" />
                    <p className="font-semibold text-blue-700">
                      {task.status === 'submitted' ? 'You have submitted' :
                       task.status === 'approved' ? 'Task approved' :
                       'Task needs revision'}
                    </p>
                    <Button 
                      onClick={() => navigate(`/task/${task.id}`)}
                      variant="outline"
                      className="w-full"
                    >
                      View Task Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!canApply && task.status === 'published' && currentUser.role === 'worker' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      {task.clientId === currentUser.id 
                        ? 'This is your task' 
                        : 'You cannot apply for this task'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowseTaskDetails;
