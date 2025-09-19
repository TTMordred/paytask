import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { mockTasks, currentUser, addTask, Task } from '@/lib/mockData';

const CreateTask = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title || !description || !reward || !deadline || !category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if reward is a valid number
    const rewardNum = parseFloat(reward);
    if (isNaN(rewardNum) || rewardNum <= 0) {
      toast({
        title: "Invalid Reward",
        description: "Please enter a valid reward amount.",
        variant: "destructive",
      });
      return;
    }

    // Check if deadline is in the future
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      toast({
        title: "Invalid Deadline",
        description: "Deadline must be in the future.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate a unique ID based on timestamp and random number
      const uniqueId = String(Date.now() + Math.random().toString(36).substr(2, 9));
      
      const newTask: Task = {
        id: uniqueId,
        title: title.trim(),
        description: description.trim(),
        reward: rewardNum,
        deadline: deadlineDate.toISOString(),
        category: category.trim(),
        status: 'published',
        clientId: currentUser.id,
        workerId: undefined,
        createdAt: new Date().toISOString(),
        submittedAt: undefined,
        submissionNotes: undefined,
        attachments: [],
        tags: [],
        difficulty: 'medium',
      };

      // Add the new task
      addTask(newTask);
      
      toast({
        title: "Task Created Successfully!",
        description: `Your task "${title}" has been published and is now available for workers to apply.`,
      });

      // Clear form
      setTitle('');
      setDescription('');
      setReward('');
      setDeadline('');
      setCategory('');

      // Navigate to browse tasks to see the new task
      navigate('/browse');
      
    } catch (error) {
      toast({
        title: "Error Creating Task",
        description: "There was an error creating your task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Create New Task
            </h1>
            <p className="text-muted-foreground mt-1">
              Define the details for your new task
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto bg-gradient-card border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-primary" />
              <span>Task Details</span>
            </CardTitle>
            <CardDescription>
              Fill in the information for the task you want to create.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Write a blog post about AI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the task requirements."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reward">Reward ($)</Label>
                <Input
                  id="reward"
                  type="number"
                  placeholder="e.g., 50.00"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  type="text"
                  placeholder="e.g., Writing, Design, Development"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary shadow-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Task...' : 'Create Task'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateTask;
