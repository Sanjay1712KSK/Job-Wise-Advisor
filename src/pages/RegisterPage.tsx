
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { BriefcaseBusiness } from "lucide-react";
import { availableSkills } from "@/lib/mockDatabase";
import { Badge } from "@/components/ui/badge";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      if (selectedSkills.length < 5) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    
    setPasswordError("");
    setIsLoading(true);
    
    const success = await register(name, email, password, selectedSkills);
    
    setIsLoading(false);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <Layout className="flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <BriefcaseBusiness className="h-12 w-12 text-job-primary" />
          </div>
          <h1 className="text-3xl font-bold mt-4 text-job-primary">Join JobWise</h1>
          <p className="text-gray-500 mt-2">Create an account to find perfect job matches</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordError && (
                  <p className="text-xs text-red-500">{passwordError}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <Label>Select Your Skills (max 5)</Label>
                <div className="text-xs text-gray-500 mb-2">
                  Select your skills to help us recommend relevant jobs
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map(skill => (
                    <Badge 
                      key={skill}
                      className="bg-job-highlight cursor-pointer"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill} ✕
                    </Badge>
                  ))}
                </div>
                
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {availableSkills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                          disabled={!selectedSkills.includes(skill) && selectedSkills.length >= 5}
                        />
                        <label
                          htmlFor={`skill-${skill}`}
                          className="text-sm cursor-pointer"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-job-primary hover:bg-job-secondary"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              
              <div className="text-sm text-center text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-job-highlight hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPage;
