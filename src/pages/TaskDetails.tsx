import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { DollarSign, CheckCircle, XCircle, Star } from 'lucide-react';
import { mockTasks, getTasksByUserId, currentUser, mockPayments, Payment, Task, addPayment, updateTaskStatus } from '@/lib/mockData'; // Assuming mockPayments can be updated

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<'not_deposited' | 'deposited' | 'released'>('not_deposited');

  useEffect(() => {
    const foundTask = mockTasks.find(t => t.id === id);
    setTask(foundTask);

    if (foundTask) {
      const existingPayment = mockPayments.find(p => p.taskId === foundTask.id && p.type === 'deposit');
      if (existingPayment) {
        setPaymentStatus(existingPayment.status === 'escrowed' ? 'deposited' : 'released');
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Task: {task.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              Details and actions for your task
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <Card className="max-w-3xl mx-auto bg-gradient-card border border-border/50">
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription>Category: {task.category} | Reward: ${task.reward} | Deadline: {new Date(task.deadline).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{task.description}</p>
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                task.status === 'published' ? 'bg-primary/20 text-primary' :
                task.status === 'in_progress' ? 'bg-warning/20 text-warning' :
                task.status === 'submitted' ? 'bg-info/20 text-info' :
                task.status === 'approved' ? 'bg-success/20 text-success' :
                'bg-destructive/20 text-destructive'
              }`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>

            {currentUser.role === 'client' && currentUser.id === task.clientId && (
              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="text-lg font-semibold">Client Actions</h3>
                {paymentStatus === 'not_deposited' && (
                  <Button onClick={handleDeposit} className="bg-gradient-primary shadow-primary">
                    <DollarSign className="w-4 h-4 mr-2" /> Deposit ${task.reward} into Escrow
                  </Button>
                )}
                {paymentStatus === 'deposited' && task.status === 'submitted' && (
                  <div className="flex space-x-2">
                    <Button onClick={handleApprove} className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" /> Approve Task
                    </Button>
                    <Button onClick={handleReject} variant="destructive">
                      <XCircle className="w-4 h-4 mr-2" /> Reject / Request Revision
                    </Button>
                  </div>
                )}
                {task.status === 'approved' && !task.clientRating && (
                  <Button onClick={() => navigate(`/task/${task.id}/rate-worker`)} className="bg-gradient-primary shadow-primary">
                    <Star className="w-4 h-4 mr-2" /> Rate Worker
                  </Button>
                )}
                {task.status === 'approved' && task.clientRating && (
                  <p className="text-muted-foreground text-sm">You have already rated the worker for this task.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TaskDetails;
