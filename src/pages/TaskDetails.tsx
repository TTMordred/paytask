import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Star, 
  Ban, 
  Upload, 
  FileText, 
  Send,
  Calendar,
  User,
  Clock,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { 
  getTaskById, 
  getUserById,
  currentUser, 
  mockPayments, 
  Payment, 
  Task, 
  addPayment, 
  updateTaskStatus, 
  cancelTask 
} from '@/lib/mockData';

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [client, setClient] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'not_deposited' | 'deposited' | 'released'>('not_deposited');
  
  // Submission states
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  useEffect(() => {
    if (id) {
      const foundTask = getTaskById(id);
      setTask(foundTask);

      if (foundTask) {
        // Get client information
        const taskClient = getUserById(foundTask.clientId);
        setClient(taskClient);

        // Check payment status
        const existingPayment = mockPayments.find(p => p.taskId === foundTask.id && p.type === 'deposit');
        if (existingPayment) {
          setPaymentStatus(existingPayment.status === 'escrowed' ? 'deposited' : 'released');
        }

        // Set existing submission notes if available
        if (foundTask.submissionNotes) {
          setSubmissionNotes(foundTask.submissionNotes);
        }
      }
    }
  }, [id]);

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">Task Not Found</h1>
          <p className="text-muted-foreground mt-2">The task you are looking for does not exist.</p>
          <Button className="mt-4" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </main>
      </div>
    );
  }

  const handleDeposit = () => {
    // In a real app, this would be an API call to a payment gateway
    console.log(`Depositing $${task.reward} for task ${task.id}`);
    const newPayment: Payment = {
      id: String(mockPayments.length + 1),
      taskId: task.id,
      amount: task.reward,
      status: 'escrowed',
      type: 'deposit',
      createdAt: new Date().toISOString(),
    };
    addPayment(newPayment); // Use helper function
    setPaymentStatus('deposited');
    alert(`$${task.reward} deposited into escrow for this task.`);
    // After deposit, update task status to 'published' if it's not already
    if (task.status === 'draft') {
      updateTaskStatus(task.id, 'published');
      setTask(prevTask => prevTask ? { ...prevTask, status: 'published' } : undefined);
    }
  };

  const handleApprove = () => {
    if (!task) return;
    // Logic to approve the task, release funds, and prompt for rating
    updateTaskStatus(task.id, 'approved');
    setTask(prevTask => prevTask ? { ...prevTask, status: 'approved' } : undefined);

    // In a real app, this would involve releasing funds via payment system
    const paymentToRelease = mockPayments.find(p => p.taskId === task.id && p.type === 'deposit' && p.status === 'escrowed');
    if (paymentToRelease) {
      paymentToRelease.status = 'released'; // Update payment status
      // Add a payment record for the worker
      const workerPayment: Payment = {
        id: String(mockPayments.length + 1),
        taskId: task.id,
        amount: task.reward,
        status: 'released',
        type: 'payment',
        createdAt: new Date().toISOString(),
      };
      addPayment(workerPayment);
    }

    alert('Task approved! Funds released to worker. Please rate the worker.');
    navigate(`/task/${task.id}/rate-worker`);
  };

  const handleReject = () => {
    if (!task) return;
    // Logic to reject the task or request revision
    updateTaskStatus(task.id, 'rejected'); // Or 'in_progress' for revision
    setTask(prevTask => prevTask ? { ...prevTask, status: 'rejected' } : undefined);
    alert('Task rejected/revision requested. Worker will be notified.');
    // Navigate to a revision request page or show a modal
  };

  const handleCancel = () => {
    if (!task || !window.confirm('Are you sure you want to cancel this task? This action cannot be undone.')) return;

    cancelTask(task.id);
    setTask(prevTask => prevTask ? { ...prevTask, status: 'cancelled' } : undefined);
    toast({
      title: "Task Cancelled",
      description: "Task has been cancelled successfully!",
    });
    navigate('/dashboard');
  };

  // Task submission handler for workers
  const handleSubmitTask = async () => {
    if (!task || !submissionNotes.trim()) {
      toast({
        title: "Submission Error",
        description: "Please enter submission notes.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update task status and save submission data
      const submissionData = {
        submissionNotes: submissionNotes.trim(),
        submittedAt: new Date().toISOString(),
        attachments: attachments.length > 0 ? attachments : undefined
      };
      
      updateTaskStatus(task.id, 'submitted', undefined, submissionData);
      
      // Update local state
      setTask(prev => prev ? {
        ...prev,
        status: 'submitted',
        submittedAt: submissionData.submittedAt,
        submissionNotes: submissionData.submissionNotes,
        attachments: submissionData.attachments
      } : undefined);
      setShowSubmissionForm(false);

      toast({
        title: "Submission Successful!",
        description: "Task has been submitted successfully. The client will be notified for review.",
      });

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAttachment = () => {
    // In a real app, this would open a file picker
    const fileName = prompt('Enter file name (demo):');
    if (fileName && fileName.trim()) {
      setAttachments(prev => [...prev, fileName.trim()]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'submitted': return 'Submitted';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/browse/${task.id}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Task Information
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              {task.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              Details and actions for your task
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/browse')}>
              Browse Tasks
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Information */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusText(task.status)}
                      </Badge>
                      <Badge variant="outline">{task.category}</Badge>
                      <Badge variant="secondary">
                        {task.difficulty === 'easy' ? 'Easy' :
                         task.difficulty === 'medium' ? 'Medium' :
                         task.difficulty === 'hard' ? 'Hard' : task.difficulty}
                      </Badge>
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
                    <h3 className="font-semibold mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Task Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{task.description}</p>
                  </div>

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

                  {task.tags && task.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.submissionNotes && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submission Notes
                      </h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm">{task.submissionNotes}</p>
                      </div>
                    </div>
                  )}

                  {task.attachments && task.attachments.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Attachments</h3>
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

            {/* Submission Form for Workers */}
            {currentUser.role === 'worker' && task.workerId === currentUser.id && task.status === 'in_progress' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Submit Task
                  </CardTitle>
                  <CardDescription>
                    Complete the task and submit the results for client review
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="submission-notes">Submission Notes *</Label>
                    <Textarea
                      id="submission-notes"
                      placeholder="Describe in detail the completed work, results achieved, and any other important information..."
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      rows={6}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Please describe in detail the completed work
                    </p>
                  </div>

                  <div>
                    <Label>Attachments (optional)</Label>
                    <div className="mt-2 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            <span className="text-sm">{file}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddAttachment}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Add Attachment
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmitTask}
                      disabled={isSubmitting || !submissionNotes.trim()}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Task
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Client Actions */}
            {currentUser.role === 'client' && currentUser.id === task.clientId && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentStatus === 'not_deposited' && (
                    <Button onClick={handleDeposit} className="w-full">
                      <DollarSign className="w-4 h-4 mr-2" /> 
                      Deposit ${task.reward.toLocaleString()}
                    </Button>
                  )}
                  
                  {paymentStatus === 'deposited' && task.status === 'submitted' && (
                    <div className="space-y-2">
                      <Button onClick={handleApprove} className="w-full bg-green-500 hover:bg-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve Task
                      </Button>
                      <Button onClick={handleReject} variant="destructive" className="w-full">
                        <XCircle className="w-4 h-4 mr-2" /> Reject / Request Revision
                      </Button>
                    </div>
                  )}
                  
                  {task.status === 'approved' && !task.clientRating && (
                    <Button onClick={() => navigate(`/task/${task.id}/rate-worker`)} className="w-full">
                      <Star className="w-4 h-4 mr-2" /> Rate Worker
                    </Button>
                  )}
                  
                  {task.status === 'approved' && task.clientRating && (
                    <p className="text-muted-foreground text-sm text-center">
                      You have already rated the worker for this task.
                    </p>
                  )}

                  {task.status === 'published' && (
                    <Button onClick={handleCancel} variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10">
                      <Ban className="w-4 h-4 mr-2" /> Cancel Task
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            {client && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="font-semibold">{client.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-semibold">{client.reputation.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completed Tasks</span>
                      <span className="font-semibold">{client.completedTasks}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Task Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reward</span>
                    <span className="font-bold text-green-600">
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
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusText(task.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Messages */}
            {task.status === 'submitted' && task.workerId === currentUser.id && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                    <p className="font-semibold text-green-700">Submission Successful</p>
                    <p className="text-sm text-muted-foreground">
                      The client will review and respond as soon as possible
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {task.status === 'approved' && task.workerId === currentUser.id && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                    <p className="font-semibold text-green-700">Task Approved</p>
                    <p className="text-sm text-muted-foreground">
                      Congratulations! The reward has been transferred to your account
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {task.status === 'rejected' && task.workerId === currentUser.id && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                    <p className="font-semibold text-red-700">Task Needs Revision</p>
                    <p className="text-sm text-muted-foreground">
                      Please review the feedback and make necessary adjustments
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

export default TaskDetails;
