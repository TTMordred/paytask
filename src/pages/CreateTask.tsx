import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { PlusCircle } from 'lucide-react';
import { mockTasks, currentUser, addTask, Task } from '@/lib/mockData'; // Assuming mockTasks can be updated or a new function will handle task creation

const CreateTask = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState(''); // New field for category

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!title || !description || !reward || !deadline || !category) {
      alert('Please fill in all fields.');
      return;
    }

    const newTask: Task = {
      id: String(mockTasks.length + 1), // Simple ID generation
      title,
      description,
      reward: parseFloat(reward),
      deadline,
      category,
      status: 'published', // Initial status
      clientId: currentUser.id,
      workerId: undefined, // Explicitly set to undefined as per Task interface
      createdAt: new Date().toISOString(), // Set creation date
      submittedAt: undefined,
      submissionNotes: undefined,
      attachments: [],
      tags: [], // Add tags if needed
      difficulty: 'medium', // Default difficulty
    };

    addTask(newTask); // Add the new task using the helper function
    alert('Task created successfully!');
    navigate('/dashboard');
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
              <Button type="submit" className="w-full bg-gradient-primary shadow-primary">
                Create Task
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateTask;
