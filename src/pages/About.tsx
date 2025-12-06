import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const About = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Layer 1 - Title */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-subtle opacity-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-peach rounded-full blur-3xl opacity-30" />
        
        <div className="container-main relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            About <span className="text-gradient">SACE</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Revolutionizing Learning Through Intelligent AI Checking
          </p>
        </div>
      </section>

      {/* Layer 2 - Our Mission */}
      <section className="section-padding bg-muted/30">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At SACE, we believe that every student and instructor deserves access to powerful tools 
              that enhance the learning experience. Our mission is to democratize requirements engineering 
              education by providing an intelligent platform that analyzes, validates, and improves 
              Software Requirements Specifications. We're committed to helping the next generation of 
              software engineers develop the skills they need to build better software through clearer, 
              more comprehensive requirements documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Layer 3 - How It Works */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Upload your documents. SACE analyzes grammar, structure, compliance, and generates 
              AI-powered feedback. Access everything in your dashboard. Our advanced algorithms 
              check your requirements against industry standards, identify ambiguities, and suggest 
              improvements — all in real-time. Whether you're a student learning the fundamentals 
              or an instructor evaluating assignments, SACE streamlines your workflow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/#features')}
                className="gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Learn More About Features
              </Button>
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate('/register')}
                className="gap-2"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Layer 4 - Our Vision */}
      <section className="section-padding bg-muted/30">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
              Our Vision
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We envision a future where every software project starts with crystal-clear requirements. 
              A world where miscommunication between stakeholders is eliminated, where students graduate 
              with real-world skills in requirements engineering, and where instructors can focus on 
              teaching rather than tedious document reviews. SACE is more than a tool — it's a movement 
              toward better software development practices. We're building the foundation for the next 
              generation of software excellence, one requirement at a time.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
