import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-subtle opacity-50" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-peach rounded-full blur-3xl opacity-30 animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="container-main relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/50 border border-border rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI-Powered SRS Analysis</span>
          </div>

          {/* Main headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Stop Worrying About{' '}
            <span className="text-gradient">Requirements</span>,{' '}
            Start Building Better Software
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            SACE uses advanced AI to analyze your Software Requirements Specifications, 
            ensuring clarity, completeness, and compliance — so you can focus on what matters most.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
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
      </div>
    </section>
  );
};

export default HeroSection;
