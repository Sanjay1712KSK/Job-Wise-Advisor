
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { getAllJobs, getRecommendedJobs, Job, searchJobs } from "@/lib/mockDatabase";
import { 
  BriefcaseBusiness, 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign,
  TrendingUp
} from "lucide-react";

const JobsPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const jobs = getAllJobs();
    setAllJobs(jobs);
    
    if (user) {
      const recommended = getRecommendedJobs(user.skills);
      setRecommendedJobs(recommended);
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchJobs(searchQuery);
      setAllJobs(results);
    } else {
      setAllJobs(getAllJobs());
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setAllJobs(getAllJobs());
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
          <h1 className="text-2xl font-bold text-job-primary">Job Listings</h1>
          <p className="text-gray-500">Explore job opportunities that match your skills</p>
        </div>

        <Card>
          <CardHeader>
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search jobs, skills, or companies..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-job-primary hover:bg-job-secondary">
                Search
              </Button>
              {searchQuery && (
                <Button type="button" variant="outline" onClick={resetSearch}>
                  Clear
                </Button>
              )}
            </form>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="recommended">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="all">All Jobs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommended" className="mt-4 space-y-4">
                {recommendedJobs.length > 0 ? (
                  recommendedJobs.map((job) => (
                    <JobCard key={job.id} job={job} userSkills={user.skills} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recommended jobs found</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="all" className="mt-4 space-y-4">
                {allJobs.length > 0 ? (
                  allJobs.map((job) => (
                    <JobCard key={job.id} job={job} userSkills={user.skills} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No jobs found matching your search</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

interface JobCardProps {
  job: Job;
  userSkills: string[];
}

const JobCard: React.FC<JobCardProps> = ({ job, userSkills }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate matching score
  const matchingSkills = job.requiredSkills.filter(skill => userSkills.includes(skill));
  const matchPercentage = Math.round((matchingSkills.length / job.requiredSkills.length) * 100);
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-job-primary">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>
        <div>
          <Badge className={matchPercentage >= 50 ? "bg-job-accent" : "bg-gray-400"}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {matchPercentage}% Match
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
            variant={userSkills.includes(skill) ? "default" : "outline"}
            className={userSkills.includes(skill) ? "bg-job-highlight" : ""}
          >
            {skill}
          </Badge>
        ))}
      </div>
      
      {expanded && (
        <div className="mt-4">
          <p className="text-sm text-gray-700">{job.description}</p>
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Show More"}
        </Button>
        
        <Button className="bg-job-primary hover:bg-job-secondary">
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default JobsPage;
