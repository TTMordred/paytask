import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Star } from 'lucide-react';
import { mockTasks, mockRatings, currentUser, Rating, updateTaskClientRating } from '@/lib/mockData'; // Assuming mockRatings can be updated

const RateWorker = () => {
  const { id } = useParams<{ id: string }>(); // Task ID
  const navigate = useNavigate();
  const [task, setTask] = useState(mockTasks.find(t => t.id === id));
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!task) {
      alert('Task not found.');
      navigate('/dashboard');
    }
  }, [task, navigate]);

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }

    const newRating: Rating = {
      id: String(mockRatings.length + 1),
      taskId: task.id,
      fromUserId: currentUser.id,
      toUserId: task.workerId!, // Assuming workerId exists if task is approved
      rating: rating,
      comment: comment,
      createdAt: new Date().toISOString(),
    };

    mockRatings.push(newRating); // Directly modifying mock data

    // Update task with clientRating using helper function
    updateTaskClientRating(task.id, rating);
    setTask(prevTask => prevTask ? { ...prevTask, clientRating: rating } : undefined); // Update local state

    alert('Worker rated successfully!');
    navigate(`/task/${task.id}`); // Go back to task details
  };

  if (!task) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Rate Worker for "{task.title}"
            </h1>
            <p className="text-muted-foreground mt-1">
              Share your feedback on the worker's performance
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(`/task/${task.id}`)}>
            Back to Task
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto bg-gradient-card border border-border/50">
          <CardHeader>
            <CardTitle>Worker Rating</CardTitle>
            <CardDescription>
              Please provide a star rating and optional feedback for the worker who completed this task.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitRating} className="space-y-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <Star
                      key={starValue}
                      className={`w-8 h-8 cursor-pointer ${
                        starValue <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                      }`}
                      onClick={() => handleStarClick(starValue)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="comment">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with the worker..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary shadow-primary">
                Submit Rating
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RateWorker;
