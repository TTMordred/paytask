import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { ArrowRight, CheckCircle, DollarSign, Users, Zap, Shield, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Secure Escrow',
      description: 'Your money is protected until work is completed to your satisfaction'
    },
    {
      icon: Zap,
      title: 'Fast Payments',
      description: 'Workers get paid instantly upon task approval via micropayments'
    },
    {
      icon: Star,
      title: 'Quality Control',
      description: 'Built-in QA layer and reputation system ensures high-quality work'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Two-way rating system builds trust between clients and workers'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Tasks Completed' },
    { value: '$250K+', label: 'Paid to Workers' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '2 min', label: 'Average Payout Time' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            🚀 Now Live: Instant Micropayments
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get Work Done,{' '}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Get Paid Fast
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            PayTask connects clients with skilled workers for quick tasks. 
            Secure escrow protection and instant payments make freelancing simple and safe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-primary shadow-primary text-lg px-8"
              onClick={() => navigate('/browse')}
            >
              Find Work
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={() => navigate('/dashboard')}
            >
              Post a Task
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose PayTask?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've built the most secure and efficient platform for micro-task freelancing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How PayTask Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple process, powerful results
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Client Flow */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">For Clients</h3>
              <div className="space-y-4">
                {[
                  'Create task with clear description and budget',
                  'Deposit funds into secure escrow',
                  'Review submissions from qualified workers',
                  'Approve work and funds are released instantly'
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Worker Flow */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-accent">For Workers</h3>
              <div className="space-y-4">
                {[
                  'Browse available tasks that match your skills',
                  'Accept tasks and complete high-quality work',
                  'Submit your work with proof and notes',
                  'Get paid instantly once approved'
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of clients and workers already using PayTask for secure, fast freelancing
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8"
              onClick={() => navigate('/browse')}
            >
              <Users className="mr-2 w-5 h-5" />
              I'm a Worker
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8"
              onClick={() => navigate('/dashboard')}
            >
              <DollarSign className="mr-2 w-5 h-5" />
              I'm a Client
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PT</span>
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                PayTask
              </span>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2024 PayTask. Secure freelancing made simple.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
