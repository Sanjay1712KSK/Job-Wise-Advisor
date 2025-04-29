
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { availableSkills } from "@/lib/mockDatabase";
import { User, Key, LogOut } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user, isLoading: authLoading, logout, updateSkills } = useAuth();
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      setSelectedSkills(user.skills);
    }
  }, [user]);

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      if (selectedSkills.length < 5) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  const saveSkills = () => {
    updateSkills(selectedSkills);
    setIsEditingSkills(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-job-primary">Your Profile</h1>
          <p className="text-gray-500">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-job-accent" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your personal account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <div className="font-medium">{user.name}</div>
              </div>
              
              <div className="space-y-1">
                <Label>Email</Label>
                <div className="font-medium">{user.email}</div>
              </div>
              
              <div className="space-y-1">
                <Label>Account Created</Label>
                <div className="text-sm text-gray-500">April 28, 2025</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="w-full flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardFooter>
          </Card>

          {/* Skills Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2 text-job-accent" />
                Skills
              </CardTitle>
              <CardDescription>
                Update your skills to get better job recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditingSkills ? (
                <div className="space-y-4">
                  <div className="text-sm">
                    Select up to 5 skills that best represent your expertise
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
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
                  
                  <ScrollArea className="h-48 border rounded-md p-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  </ScrollArea>
                </div>
              ) : (
                <div>
                  <div className="text-sm mb-3">
                    Your current skills:
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {user.skills.length > 0 ? (
                      user.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No skills added yet</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {isEditingSkills ? (
                <div className="flex space-x-2 w-full">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => {
                      setSelectedSkills(user.skills);
                      setIsEditingSkills(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-job-primary hover:bg-job-secondary" 
                    onClick={saveSkills}
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full bg-job-primary hover:bg-job-secondary" 
                  onClick={() => setIsEditingSkills(true)}
                >
                  Edit Skills
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
