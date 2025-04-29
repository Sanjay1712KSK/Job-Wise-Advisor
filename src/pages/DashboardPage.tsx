
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { getRecommendedJobs, Job, availableSkills } from "@/lib/mockDatabase";
import { Badge } from "@/components/ui/badge";
import { 
  BriefcaseBusiness, 
  MessageSquareText, 
  TrendingUp, 
  User, 
  MapPin, 
  Calendar, 
  DollarSign 
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const DashboardPage: React.FC = () => {
  const { user, isLoading: authLoading, updateSkills } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [isEditing, setIsEditing] = useState(false);
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
      // Set skills from user
      setSelectedSkills(user.skills);
      
      // Get recommended jobs
      const jobs = getRecommendedJobs(user.skills);
      setRecommendedJobs(jobs);
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
    setIsEditing(false);
    
    // Update jobs based on new skills
    const jobs = getRecommendedJobs(selectedSkills);
    setRecommendedJobs(jobs);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-job-primary">Welcome back, {user.name}!</h1>
            <p className="text-gray-500">Here are your job recommendations based on your skills.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              onClick={() => navigate("/chatbot")}
              className="bg-job-highlight hover:bg-job-accent text-white flex items-center"
            >
              <MessageSquareText className="h-4 w-4 mr-2" />
              Ask AI Assistant
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Skills Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-job-accent" />
                Your Skills
              </CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Select up to 5 skills" 
                  : "Skills used for job recommendations"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
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
                    <div className="grid grid-cols-1 gap-2">
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
                <div className="space-y-2">
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
              {isEditing ? (
                <div className="flex space-x-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1" 
                    onClick={() => {
                      setSelectedSkills(user.skills);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1 bg-job-primary hover:bg-job-secondary" 
                    onClick={saveSkills}
                  >
                    Save Skills
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Skills
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Job Recommendations Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BriefcaseBusiness className="h-5 w-5 mr-2 text-job-accent" />
                Recommended Jobs
              </CardTitle>
              <CardDescription>
                Personalized job recommendations based on your skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedJobs.length > 0 ? (
                  recommendedJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-job-primary">{job.title}</h3>
                          <p className="text-sm text-gray-500">{job.company}</p>
                        </div>
                        <div>
                          <Badge className="bg-job-accent">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {Math.round((job.requiredSkills.filter(skill => 
                              user.skills.includes(skill)).length / job.requiredSkills.length) * 100)}% Match
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" /> {job.salary}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> Posted {job.postedDate}
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-1">
                        {job.requiredSkills.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant={user.skills.includes(skill) ? "default" : "outline"}
                            className={user.skills.includes(skill) ? "bg-job-highlight" : ""}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No job recommendations found</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate("/jobs")}
              >
                View All Jobs
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
