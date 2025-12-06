import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, ChevronRight, Sparkles, FileCheck, Zap } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Analysis',
    description: 'Get instant feedback on your SRS documents with advanced AI.',
  },
  {
    icon: FileCheck,
    title: 'Compliance Checking',
    description: 'Ensure your requirements meet industry standards.',
  },
  {
    icon: Zap,
    title: 'Real-time Collaboration',
    description: 'Work together with your team seamlessly.',
  },
  {
    icon: Sparkles,
    title: 'Smart Suggestions',
    description: 'Receive actionable improvements for clarity.',
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Cycle through features: 0 -> 2 -> 0... (showing features[0/1] then features[2/3])
      setCurrentFeatureIndex((prev) => (prev === 0 ? 2 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login({ email, password });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // Handler for successful Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);

    const result = await googleLogin(credentialResponse);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // 3. Handler for failed Google login
  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again or use email/password.');
  };

  const goToPreviousFeature = () => {
    setCurrentFeatureIndex((prev) => (prev === 0 ? 2 : 0));
  };

  const goToNextFeature = () => {
    setCurrentFeatureIndex((prev) => (prev === 2 ? 0 : 2));
  };

  const visibleFeatures = [
    features[currentFeatureIndex],
    features[(currentFeatureIndex + 1) % features.length],
  ];

  return (
    <Layout>
      <section className="section-padding min-h-[calc(100vh-200px)] flex items-center">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side - Branding (No change) */}
            <div className="hidden lg:block">
              <div className="max-w-lg">
                <h1 className="font-display text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-6">
                  Unlock Your{' '}
                  <span className="text-gradient">Learning Potential</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-12">
                  Join thousands of students and instructors who are revolutionizing 
                  their requirements engineering workflow with SACE.
                </p>

                {/* Feature carousel (No change) */}
                <div className="relative">
                  <div className="flex gap-4">
                    {visibleFeatures.map((feature, idx) => {
                      const IconComponent = feature.icon;
                      return (
                        <div
                          key={`${feature.title}-${idx}`}
                          className="flex-1 bg-card rounded-xl p-6 shadow-card animate-fade-in"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-display font-semibold text-foreground mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <Button variant="ghost" size="icon" onClick={goToPreviousFeature} className="rounded-full">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex gap-2">
                      {[0, 2].map((idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentFeatureIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentFeatureIndex === idx ? 'bg-primary w-6' : 'bg-border'
                          }`}
                        />
                      ))}
                    </div>

                    <Button variant="ghost" size="icon" onClick={goToNextFeature} className="rounded-full">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    Sign In
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Welcome back Please enter your details or sign in with Google.
                  </p>
                </div>

                {/* 4. Google Login Component Integration */}
                <div className="w-full mb-6 h-12">
                  {/* Note: The GoogleLogin component is slightly less flexible for custom styling, 
                     so we rely on its default button appearance here. width="384" matches max-w-md. */}
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    width="384"
                  />
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Input (No change) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input (No change) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Checkbox and Forgot Password (No change) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked)}
                      />
                      <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <Link to="/register" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Error Message (No change) */}
                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Submit Button (No change) */}
                  <Button type="submit" variant="hero" className="w-full h-12" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                {/* Sign Up Link (No change) */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;