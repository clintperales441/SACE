import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, LogIn, Rocket, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-main flex h-16 items-center justify-between px-4 md:px-8">
        {/* Left side - Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <span className="text-primary-foreground font-display font-bold text-lg">S</span>
          </div>
          <span className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
            SACE
          </span>
        </Link>

        {/* Right side - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="gap-2"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
          
          <Button
            variant="hero"
            onClick={() => navigate('/register')}
            className="gap-2"
          >
            <Rocket className="h-4 w-4" />
            Get Started
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container-main py-4 px-4 flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => {
                navigate('/login');
                setIsMenuOpen(false);
              }}
              className="w-full gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
            
            <Button
              variant="hero"
              onClick={() => {
                navigate('/register');
                setIsMenuOpen(false);
              }}
              className="w-full gap-2"
            >
              <Rocket className="h-4 w-4" />
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
