
import React, { createContext, useContext, useState, useEffect } from "react";
import { findUserByEmail, registerUser, User } from "../lib/mockDatabase";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, skills: string[]) => Promise<boolean>;
  logout: () => void;
  updateSkills: (skills: string[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("jobWiseUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const foundUser = findUserByEmail(email);
      if (foundUser && foundUser.password === password) {
        setUser(foundUser);
        localStorage.setItem("jobWiseUser", JSON.stringify(foundUser));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${foundUser.name}!`,
          variant: "default",
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    skills: string[]
  ): Promise<boolean> => {
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        toast({
          title: "Registration Failed",
          description: "Email already in use",
          variant: "destructive",
        });
        return false;
      }

      const newUser = registerUser(name, email, password, skills);
      setUser(newUser);
      localStorage.setItem("jobWiseUser", JSON.stringify(newUser));
      toast({
        title: "Registration Successful",
        description: `Welcome to JobWise, ${name}!`,
        variant: "default",
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jobWiseUser");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
      variant: "default",
    });
  };

  const updateSkills = (skills: string[]) => {
    if (user) {
      const updatedUser = { ...user, skills };
      setUser(updatedUser);
      localStorage.setItem("jobWiseUser", JSON.stringify(updatedUser));
      toast({
        title: "Skills Updated",
        description: "Your skills have been updated successfully",
        variant: "default",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateSkills }}>
      {children}
    </AuthContext.Provider>
  );
};
