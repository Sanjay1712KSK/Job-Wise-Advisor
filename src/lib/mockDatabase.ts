
// Mock database for our application

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this should be hashed
  skills: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  location: string;
  salary: string;
  postedDate: string;
}

// Available skills for the platform
export const availableSkills = [
  "Python", "JavaScript", "React", "Node.js", "Java", "C++", "C#",
  "SQL", "MongoDB", "Docker", "AWS", "Azure", "GCP",
  "Machine Learning", "Data Science", "DevOps", "UI/UX Design",
  "Project Management", "Agile", "Scrum", "TypeScript"
];

// Mock users database
const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this should be hashed
    skills: ["JavaScript", "React", "TypeScript"]
  }
];

// Mock jobs database
const jobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Tech Solutions Inc.",
    description: "We are looking for a skilled Frontend Developer to join our team. You'll be responsible for building responsive user interfaces using React.",
    requiredSkills: ["JavaScript", "React", "TypeScript", "HTML", "CSS"],
    location: "San Francisco, CA",
    salary: "$100,000 - $130,000",
    postedDate: "2025-04-20"
  },
  {
    id: "2",
    title: "Backend Developer",
    company: "DataWare Systems",
    description: "Join our backend team to build robust and scalable APIs using Node.js and Express.",
    requiredSkills: ["JavaScript", "Node.js", "Express", "MongoDB", "SQL"],
    location: "Remote",
    salary: "$90,000 - $120,000",
    postedDate: "2025-04-22"
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "Analytics Pro",
    description: "Looking for a data scientist to analyze large datasets and build machine learning models.",
    requiredSkills: ["Python", "Machine Learning", "Data Science", "SQL", "Statistics"],
    location: "New York, NY",
    salary: "$120,000 - $150,000",
    postedDate: "2025-04-15"
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "Cloud Systems",
    description: "Help us automate and optimize our infrastructure using cloud technologies.",
    requiredSkills: ["DevOps", "AWS", "Docker", "Kubernetes", "CI/CD"],
    location: "Chicago, IL",
    salary: "$110,000 - $140,000",
    postedDate: "2025-04-18"
  },
  {
    id: "5",
    title: "Full Stack Developer",
    company: "WebApp Solutions",
    description: "Looking for a full stack developer who can work on both frontend and backend technologies.",
    requiredSkills: ["JavaScript", "React", "Node.js", "MongoDB", "TypeScript"],
    location: "Austin, TX",
    salary: "$95,000 - $125,000",
    postedDate: "2025-04-23"
  },
  {
    id: "6",
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    description: "Join our team to build cutting-edge machine learning models for real-world applications.",
    requiredSkills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Data Science"],
    location: "Seattle, WA",
    salary: "$130,000 - $160,000", 
    postedDate: "2025-04-17"
  },
  {
    id: "7",
    title: "UI/UX Designer",
    company: "Design Masters",
    description: "Create beautiful and functional user interfaces for web and mobile applications.",
    requiredSkills: ["UI/UX Design", "Figma", "Adobe XD", "User Research"],
    location: "Los Angeles, CA",
    salary: "$85,000 - $110,000",
    postedDate: "2025-04-21"
  }
];

// Mock database functions
export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const registerUser = (name: string, email: string, password: string, skills: string[]): User => {
  const newUser: User = {
    id: (users.length + 1).toString(),
    name,
    email,
    password,
    skills
  };
  users.push(newUser);
  return newUser;
};

export const updateUserSkills = (userId: string, skills: string[]): User | undefined => {
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) return undefined;
  
  users[userIndex].skills = skills;
  return users[userIndex];
};

export const getRecommendedJobs = (skills: string[]): Job[] => {
  if (skills.length === 0) return jobs;
  
  return jobs.filter(job => {
    // Check if any of the user's skills match the job's required skills
    return job.requiredSkills.some(skill => skills.includes(skill));
  }).sort((a, b) => {
    // Sort by the number of matching skills (descending)
    const aMatches = a.requiredSkills.filter(skill => skills.includes(skill)).length;
    const bMatches = b.requiredSkills.filter(skill => skills.includes(skill)).length;
    return bMatches - aMatches;
  });
};

export const getAllJobs = (): Job[] => {
  return jobs;
};

export const searchJobs = (query: string): Job[] => {
  const lowerQuery = query.toLowerCase();
  return jobs.filter(job => 
    job.title.toLowerCase().includes(lowerQuery) ||
    job.company.toLowerCase().includes(lowerQuery) ||
    job.description.toLowerCase().includes(lowerQuery) ||
    job.requiredSkills.some(skill => skill.toLowerCase().includes(lowerQuery))
  );
};
