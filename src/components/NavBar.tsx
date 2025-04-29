import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { BriefcaseBusiness, User, MessageSquareText, LogOut } from "lucide-react";

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  return (
    <nav className="bg-job-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <BriefcaseBusiness className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">Job<span className="text-job-highlight">Wise</span></span>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex space-x-6">
                <NavLink to="/dashboard" current={location.pathname}>
                  Dashboard
                </NavLink>
                <NavLink to="/jobs" current={location.pathname}>
                  Jobs
                </NavLink>
                <NavLink to="/chatbot" current={location.pathname}>
                  AI Assistant
                </NavLink>
                <NavLink to="/ai-chat" current={location.pathname}>
                  OpenAI Chat
                </NavLink>
                <NavLink to="/profile" current={location.pathname}>
                  Profile
                </NavLink>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline text-sm">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-white hover:text-white hover:bg-job-secondary"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <NavLink to="/login" current={location.pathname}>
                Login
              </NavLink>
              <Button asChild variant="secondary" size="sm" className="bg-job-highlight hover:bg-job-accent text-white">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {user && (
        <div className="sm:hidden border-t border-job-secondary">
          <div className="grid grid-cols-4 text-xs font-medium">
            <NavLinkMobile to="/dashboard" current={location.pathname} icon={<User className="h-5 w-5" />} label="Dashboard" />
            <NavLinkMobile to="/jobs" current={location.pathname} icon={<BriefcaseBusiness className="h-5 w-5" />} label="Jobs" />
            <NavLinkMobile to="/chatbot" current={location.pathname} icon={<MessageSquareText className="h-5 w-5" />} label="AI Chat" />
            <NavLinkMobile to="/profile" current={location.pathname} icon={<User className="h-5 w-5" />} label="Profile" />
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  current: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, current }) => {
  const isActive = current === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 text-sm font-medium transition-colors ${
        isActive 
          ? "text-white underline underline-offset-4" 
          : "text-gray-200 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
};

interface NavLinkMobileProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  current: string;
}

const NavLinkMobile: React.FC<NavLinkMobileProps> = ({ to, icon, label, current }) => {
  const isActive = current === to;
  
  return (
    <Link
      to={to}
      className={`flex flex-col items-center py-3 ${
        isActive ? "bg-job-secondary text-white" : "text-gray-300"
      }`}
    >
      <div>{icon}</div>
      <span className="mt-1 text-xs">{label}</span>
    </Link>
  );
};

export default NavBar;
