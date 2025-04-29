
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BriefcaseBusiness, 
  Search, 
  MessageSquareText, 
  BadgeCheck, 
  Zap,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-job-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <div className="flex-1 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Perfect Job Match
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-200">
                JobWise uses AI and your skills to recommend the best job opportunities for you
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                {user ? (
                  <Button asChild size="lg" className="bg-job-highlight hover:bg-job-accent">
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="bg-job-highlight hover:bg-job-accent">
                      <Link to="/register">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-job-primary">
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl">
                <div className="flex items-center mb-4">
                  <BriefcaseBusiness className="h-8 w-8 text-job-highlight mr-2" />
                  <span className="text-2xl font-bold">JobWise</span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-md p-3 flex items-center">
                    <BadgeCheck className="text-job-highlight h-5 w-5 mr-2" />
                    <div className="text-sm">Personalized job recommendations based on your skills</div>
                  </div>
                  
                  <div className="bg-white/10 rounded-md p-3 flex items-center">
                    <MessageSquareText className="text-job-highlight h-5 w-5 mr-2" />
                    <div className="text-sm">AI-powered career assistant to answer your questions</div>
                  </div>
                  
                  <div className="bg-white/10 rounded-md p-3 flex items-center">
                    <Zap className="text-job-highlight h-5 w-5 mr-2" />
                    <div className="text-sm">Stay updated with jobs that match your expertise</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-job-primary mb-4">How JobWise Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our intelligent platform connects you with the perfect job opportunities based on your unique skills and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BadgeCheck className="h-12 w-12 text-job-accent" />}
              title="Add Your Skills"
              description="Enter your expertise and experience to help us understand your professional profile"
            />
            
            <FeatureCard 
              icon={<Search className="h-12 w-12 text-job-accent" />}
              title="Get Matched"
              description="Our algorithm finds jobs that best match your skills and experience"
            />
            
            <FeatureCard 
              icon={<MessageSquareText className="h-12 w-12 text-job-accent" />}
              title="AI Assistant"
              description="Get career advice, resume tips, and answers to job-related questions"
            />
          </div>
          
          <div className="text-center mt-12">
            {!user && (
              <Button asChild size="lg" className="bg-job-primary hover:bg-job-secondary">
                <Link to="/register">
                  Create Your Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-job-primary text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center">
              <BriefcaseBusiness className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">JobWise</span>
            </div>
            
            <div className="flex space-x-6">
              <Link to="/" className="hover:text-gray-300">Home</Link>
              <Link to="/jobs" className="hover:text-gray-300">Jobs</Link>
              {user ? (
                <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              ) : (
                <Link to="/login" className="hover:text-gray-300">Sign In</Link>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-gray-300">
              &copy; {new Date().getFullYear()} JobWise Advisor
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-job-primary mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Index;
