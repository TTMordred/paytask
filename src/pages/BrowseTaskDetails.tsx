import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Frown } from 'lucide-react';

const BrowseTaskDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 text-center">
        <Frown className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
          Functionality Under Development
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          The "Apply Now" feature for task ID "{id}" is currently under development.
          Please check back later for updates!
        </p>
        <Button onClick={() => navigate('/browse')}>
          Back to Browse Tasks
        </Button>
      </main>
    </div>
  );
};

export default BrowseTaskDetails;
