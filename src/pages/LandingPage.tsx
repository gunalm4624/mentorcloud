
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Code2, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const features = [
  {
    icon: <GraduationCap className="h-10 w-10 text-purple-400" />,
    title: "Expert Instructors",
    description: "Learn from industry leaders with years of experience in their fields."
  },
  {
    icon: <BookOpen className="h-10 w-10 text-purple-400" />,
    title: "Comprehensive Courses",
    description: "Access a wide variety of in-depth courses designed to build real skills."
  },
  {
    icon: <Calendar className="h-10 w-10 text-purple-400" />,
    title: "Personalized Mentorship",
    description: "Get one-on-one guidance from experts to accelerate your learning journey."
  },
  {
    icon: <Code2 className="h-10 w-10 text-purple-400" />,
    title: "Hands-on Projects",
    description: "Apply your knowledge through practical projects and build your portfolio."
  }
];

const benefits = [
  "Progress tracking to monitor your growth",
  "Personalized learning paths based on your goals",
  "Community forums to connect with fellow learners",
  "Certificate of completion for all courses",
  "Career guidance and job placement assistance"
];

const LandingPage = () => {
  return (
    <div className="min-h-screen dark:bg-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="border-b dark:border-gray-800 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient-purple">PrismLMS</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="hidden md:flex gap-4">
                <Link to="/auth" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">Sign In</Link>
                <Link to="/auth?tab=register" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">Register</Link>
              </div>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900/0 to-gray-900/0"></div>
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" 
          style={{ animation: 'pulse 8s infinite alternate' }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" 
          style={{ animation: 'pulse 8s infinite alternate-reverse' }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="animate-in" style={{ animationDelay: '100ms' }}>
              <span className="block text-4xl font-bold sm:text-5xl lg:text-6xl mb-4 text-gradient-purple">
                Master New Skills <br/> Unlock Your Potential
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-in" style={{ animationDelay: '200ms' }}>
              Access expert-led courses, personalized mentorship, and a supportive community to help you achieve your learning goals and advance your career.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-in" style={{ animationDelay: '300ms' }}>
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white py-6 px-8 rounded-lg text-lg">
                <Link to="/auth">Start Learning Now</Link>
              </Button>
              <Button asChild variant="outline" className="py-6 px-8 rounded-lg text-lg">
                <Link to="/auth?tab=register">Create Free Account</Link>
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 animate-in" style={{ animationDelay: '400ms' }}>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-500">100+</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Courses Available</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-500">50+</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Expert Mentors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-500">10k+</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Active Students</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-500">95%</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose PrismLMS?</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform offers everything you need to succeed in your learning journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl neo-card hover-lift animate-in"
                style={{ animationDelay: `${index * 100 + 100}ms` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 purple-gradient opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="dark:bg-gray-800/80 bg-white/90 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-xl glass-card">
            <div className="md:flex justify-between items-center gap-8">
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-4 text-gradient-purple">Ready to Start Your Learning Journey?</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Join thousands of students already learning on our platform.
                </p>
                <ul className="space-y-2 mb-8">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/3 mt-8 md:mt-0">
                <div className="p-6 border border-purple-200 dark:border-purple-900/30 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <span>Get Started Today</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Create your free account in just a few clicks and start learning.</p>
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link to="/auth" className="flex items-center justify-center gap-2">
                      Create Free Account
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-gradient-purple mb-2">PrismLMS</h2>
              <p className="text-gray-600 dark:text-gray-300">Empowering your learning journey</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <Link to="/auth" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">Sign In</Link>
              <Link to="/auth?tab=register" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">Register</Link>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">Privacy Policy</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">Terms of Service</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} PrismLMS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
