
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Twitter, Mail, ExternalLink, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tighter gradient-text">AYYAN.TECH</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === link.path ? 'text-blue-600' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/services"
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
            >
              Order Now <ExternalLink size={14} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 py-4 px-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-slate-600 hover:text-blue-600 py-2"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/services"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-blue-600 text-white px-5 py-3 rounded-xl text-base font-semibold"
          >
            Order Now
          </Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-xl font-bold text-white mb-4">AYYAN.TECH</h3>
          <p className="max-w-md text-slate-400 leading-relaxed">
            Professional tech content writing specializing in serverless, SaaS, and cloud computing. 
            Helping businesses grow their online presence with SEO-optimized, beginner-friendly content.
          </p>
          <div className="flex space-x-4 mt-6">
            <a 
              href="https://www.linkedin.com/in/ch-ayyan-jutt-a45a3b283" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-400 transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><Github size={20} /></a>
            <a href="mailto:zolly9130@gmail.com" className="hover:text-blue-400 transition-colors"><Mail size={20} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Hire Me</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Categories</h4>
          <ul className="space-y-2">
            <li><Link to="/blog" className="hover:text-white transition-colors">Serverless</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">SaaS</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Cloud Computing</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Tech Tips</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} Ayyan u l Haq. All rights reserved.</p>
        <p className="mt-4 md:mt-0 text-slate-500">Designed for modern tech entrepreneurs.</p>
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
