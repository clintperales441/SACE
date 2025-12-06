import { 
  FileSearch, 
  CheckCircle, 
  Zap, 
  Users, 
  BarChart3, 
  Shield 
} from 'lucide-react';

const features = [
  {
    icon
    title: 'Smart Document Analysis',
    description: 'Upload your SRS documents and let AI analyze structure, grammar, and clarity in seconds.',
  },
  {
    icon
    title: 'Compliance Checking',
    description: 'Automatically verify your requirements against industry standards and best practices.',
  },
  {
    icon
    title: 'Instant Feedback',
    description: 'Receive actionable suggestions and improvements in real-time work.',
  },
  {
    icon
    title: 'Collaboration Tools',
    description: 'Share documents with your team and collaborate on requirement refinements.',
  },
  {
    icon
    title: 'Analytics Dashboard',
    description: 'Track your progress and see detailed metrics about your document quality.',
  },
  {
    icon
    title: 'Secure & Private',
    description: 'Your documents are encrypted and protected with enterprise-grade security.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding bg-muted/30">
      <div className="container-main">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How SACE Helps Students & Instructors
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to streamline your requirements engineering workflow
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
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
  );
};

export default FeaturesSection;
