import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, ChevronRight, Sparkles, FileCheck, Zap } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const API_BASE_URL = 'http://localhost:8080';
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 2) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Placeholder for Google OAuth - would need @react-oauth/google provider setup
    setError('Google login is not configured yet. Please use email/password.');
  };

  const goToPreviousFeature = () => {
    setCurrentFeatureIndex((prev) => (prev - 2 + features.length) % features.length);
  };

  const goToNextFeature = () => {
    setCurrentFeatureIndex((prev) => (prev + 2) % features.length);
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
            {/* Left Side - Branding */}
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

                {/* Feature carousel */}
                <div className="relative">
                  <div className="flex gap-4">
                    {visibleFeatures.map((feature, idx) => (
                      <div
                        key={`${feature.title}-${idx}`}
                        className="flex-1 bg-card rounded-xl p-6 shadow-card animate-fade-in"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-display font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    ))}
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

                {/* Google Login */}
                <Button
                  variant="outline"
                  className="w-full mb-6 h-12"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
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

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button type="submit" variant="hero" className="w-full h-12" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

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
