import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      {/* Top Layer */}
      <div className="container-main px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Group 1: Logo + Name + Slogan */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-display font-bold text-lg">S</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground">SACE</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              SRS AI Checking Engine — Revolutionizing the way students and instructors work with software requirements.
            </p>
          </div>

          {/* Group 2: Product */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/#features" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 3: Company */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/about" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  About SACE
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 4: Legal */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Layer */}
      <div className="border-t border-border">
        <div className="container-main px-4 md:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} SACE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
