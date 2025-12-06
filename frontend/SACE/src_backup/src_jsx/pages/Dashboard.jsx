import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  FileSearch, 
  CheckCircle, 
  Zap, 
  Users, 
  BarChart3, 
  Shield 
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const dashboardFeatures = [
  {
    icon
    title: 'Upload & Analyze',
    description: 'Drag and drop your SRS documents for instant AI-powered analysis.',
  },
  {
    icon
    title: 'Track Compliance',
    description: 'Monitor your documents against multiple industry standards.',
  },
  {
    icon
    title: 'Quick Actions',
    description: 'Apply suggested fixes with one click and see improvements instantly.',
  },
  {
    icon
    title: 'Team Workspace',
    description: 'Invite collaborators and manage permissions for shared projects.',
  },
  {
    icon
    title: 'Progress Reports',
    description: 'View detailed analytics and track your improvement over time.',
  },
  {
    icon
    title: 'Version History',
    description: 'Access previous versions and compare changes between documents.',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Layer 1 - Motivational Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-subtle opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-peach rounded-full blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="container-main relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in">
            Stop Worrying About{' '}
            <span className="text-gradient">Formatting</span>
            <br />
            Focus on Your Content
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Your intelligent workspace for creating, analyzing, and perfecting 
            software requirements. Let SACE handle the details while you focus on building great software.
          </p>

          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate('/register')}
              className="gap-2 group"
            >
              Get Started For Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Layer 2 - Features Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful tools designed to streamline your requirements engineering workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {dashboardFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="card-feature group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
