
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Send, Loader2 } from "lucide-react";
import { availableSkills } from "@/lib/mockDatabase";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hello! I'm your AI assistant for job searching. I can help you with career advice, resume tips, interview preparation, or finding jobs that match your skills. What would you like help with today?",
    sender: "bot",
    timestamp: new Date(),
  },
];

const ChatbotPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateMockBotResponse = async (userText: string): Promise<string> => {
    const lowerText = userText.toLowerCase();
  
    // Simulate API call latency
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
    // Respond to common greetings
    if (lowerText.includes("hello") || lowerText.includes("hi ")) {
      return `Hello! How can I assist you today?`;
    }
  
    // Skill improvement suggestions
    if (lowerText.includes("skill") && lowerText.includes("improve")) {
      return `To improve your skills, I recommend:\n\n1. Take online courses on platforms like Coursera, Udemy, or LinkedIn Learning\n2. Work on personal projects to apply what you've learned\n3. Contribute to open-source projects\n4. Join professional communities and attend events\n5. Find a mentor in your field`;
    }
  
    // Resume/CV advice
    if (lowerText.includes("resume") || lowerText.includes("cv")) {
      return "For a strong resume, make sure to:\n\n• Tailor it to each job application\n• Use quantifiable achievements rather than just listing responsibilities\n• Include relevant keywords from the job description\n• Keep it concise (1-2 pages)\n• Proofread carefully for any errors\n\nWould you like me to review your resume? You can describe its current sections.";
    }
  
    // Interview preparation
    if (lowerText.includes("interview")) {
      return "To prepare for job interviews:\n\n1. Research the company thoroughly\n2. Practice common questions for your role\n3. Prepare concrete examples using the STAR method (Situation, Task, Action, Result)\n4. Prepare thoughtful questions to ask the interviewer\n5. Do a mock interview with a friend\n\nWhich specific aspect of interview preparation would you like help with?";
    }
  
    // Job or career recommendations based on skills
    if (lowerText.includes("recommend") && (lowerText.includes("job") || lowerText.includes("career"))) {
      if (user && user.skills.length > 0) {
        return `Based on your skills (${user.skills.join(", ")}), you might consider roles like:\n\n${
          user.skills.includes("JavaScript") || user.skills.includes("React") 
            ? "• Frontend Developer\n" : ""
        }${
          user.skills.includes("Node.js") || user.skills.includes("SQL") 
            ? "• Backend Developer\n" : ""
        }${
          (user.skills.includes("JavaScript") || user.skills.includes("React")) && 
          (user.skills.includes("Node.js") || user.skills.includes("SQL"))
            ? "• Full Stack Developer\n" : ""
        }${
          user.skills.includes("Python") || user.skills.includes("Machine Learning") || user.skills.includes("Data Science")
            ? "• Data Scientist\n• Machine Learning Engineer\n" : ""
        }${
          user.skills.includes("AWS") || user.skills.includes("Azure") || user.skills.includes("GCP")
            ? "• Cloud Engineer\n• DevOps Engineer\n" : ""
        }`;
      } else {
        return "I can provide better job recommendations if you update your skills profile. What technologies or skills are you proficient in?";
      }
    }
  
    // Salary and compensation questions
    if (lowerText.includes("salary") || lowerText.includes("pay") || lowerText.includes("compensation")) {
      return "Salary ranges vary by location, experience level, and company size. For the most accurate data, I recommend checking sites like Glassdoor, PayScale, or levels.fyi.\n\nTo negotiate effectively:\n• Research the market rate for your role and location\n• Highlight your unique value and achievements\n• Consider the total compensation package (benefits, bonuses, etc.)\n• Practice your negotiation conversation";
    }
  
    // 100+ random keyword-based responses can be added here
    if (lowerText.includes("project management") || lowerText.includes("agile")) {
      return "For effective project management:\n\n1. Understand Agile methodologies like Scrum or Kanban\n2. Communicate clearly with your team\n3. Use tools like Trello, Jira, or Asana for task tracking\n4. Be adaptable to changes in project scope or deadlines";
    }
  
    if (lowerText.includes("networking") || lowerText.includes("connections")) {
      return "Networking is key to your career growth:\n\n1. Attend industry events and conferences\n2. Join relevant LinkedIn groups and online communities\n3. Follow up after meetings with personalized messages\n4. Offer help or advice to others in your network";
    }
  
    if (lowerText.includes("cover letter")) {
      return "For a standout cover letter, remember to:\n\n• Tailor it to the job description\n• Show enthusiasm for the role and company\n• Mention key accomplishments that align with the job requirements\n• Keep it concise and error-free";
    }
  
    if (lowerText.includes("freelancing") || lowerText.includes("contract work")) {
      return "Freelancing can be a rewarding career choice. To succeed:\n\n1. Build a strong online portfolio\n2. Network to find potential clients\n3. Set clear rates and contract terms\n4. Deliver quality work on time to build your reputation";
    }
  
    if (lowerText.includes("leadership") || lowerText.includes("manager")) {
      return "Effective leadership is essential for success:\n\n1. Be a role model — lead by example\n2. Communicate clearly and regularly with your team\n3. Provide constructive feedback\n4. Foster a culture of collaboration and innovation";
    }
  
    if (lowerText.includes("tech trends") || lowerText.includes("emerging technologies")) {
      return "Some of the biggest tech trends to follow right now include:\n\n1. Artificial Intelligence and Machine Learning\n2. Cloud Computing and DevOps\n3. Cybersecurity advancements\n4. Blockchain and decentralized applications\n5. Augmented Reality (AR) and Virtual Reality (VR)";
    }
  
    if (lowerText.includes("cloud computing") || lowerText.includes("aws") || lowerText.includes("azure")) {
      return "Cloud computing is transforming the tech industry:\n\n1. Learn about services like AWS, Azure, and Google Cloud\n2. Get certified to boost your career prospects\n3. Experiment with hosting your own apps or websites in the cloud";
    }

    if (lowerText.includes("interview")) {
      return "To prepare for job interviews:\n\n1. Research the company thoroughly — know their mission, values, and recent developments\n2. Practice common interview questions and prepare concrete examples using the STAR method (Situation, Task, Action, Result)\n3. Highlight your accomplishments and skills that directly align with the job description\n4. Prepare thoughtful questions to ask the interviewer to show your interest\n5. Do mock interviews with a friend or mentor to practice your delivery and confidence";
    }
    if (lowerText.includes("python")) {
      return "Career options for someone with Python skills:\n\n1. Data Scientist — Work with data to extract meaningful insights\n2. Machine Learning Engineer — Build models and algorithms to make systems smarter\n3. Backend Developer — Develop the server-side of web applications\n4. Web Developer — Use frameworks like Django and Flask for building web apps\n5. Automation Engineer — Automate repetitive tasks and processes\n6. DevOps Engineer — Work on CI/CD pipelines and infrastructure automation";
    }
    if (lowerText.includes("advance career")) {
      return "Skills to learn to advance your career:\n\n1. Learn a second programming language (e.g., JavaScript, Java, Go)\n2. Master version control (Git) for collaboration\n3. Gain expertise in cloud platforms like AWS, Azure, or GCP\n4. Learn frameworks and libraries relevant to your domain (e.g., Django, React)\n5. Improve problem-solving and algorithmic skills\n6. Understand system design and architecture principles";
    }
    if (lowerText.includes("working from home")) {
      return "Tips for working from home:\n\n1. Set a dedicated workspace to minimize distractions\n2. Stick to a routine and manage your time effectively\n3. Use tools like Slack, Zoom, and Asana for communication and collaboration\n4. Take regular breaks to avoid burnout\n5. Stay connected with your team and maintain clear communication\n6. Set boundaries between work and personal time";
    }
    if (lowerText.includes("burnout")) {
      return "Strategies to avoid burnout:\n\n1. Prioritize self-care with regular exercise and healthy eating\n2. Take breaks throughout the day to recharge\n3. Set clear work-life boundaries to prevent overworking\n4. Break tasks into manageable chunks to avoid feeling overwhelmed\n5. Seek support from colleagues, mentors, or a therapist if needed\n6. Learn to say 'no' and delegate tasks when necessary";
    }
    if (lowerText.includes("certification")) {
      return "Tech certifications that can advance your career:\n\n1. AWS Certified Solutions Architect — Cloud computing expertise\n2. Google Professional Machine Learning Engineer — For machine learning professionals\n3. Microsoft Certified: Azure Fundamentals — Cloud computing and Microsoft Azure\n4. CompTIA Security+ — Cybersecurity fundamentals\n5. Certified Kubernetes Administrator — For DevOps and containerization\n6. Cisco Certified Network Associate (CCNA) — Networking expertise";
    }
    if (lowerText.includes("machine learning")) {
      return "Industries looking for machine learning engineers:\n\n1. Technology — Developing intelligent software and services\n2. Healthcare — Medical imaging, predictive analytics, and diagnostics\n3. Finance — Fraud detection, algorithmic trading, and risk assessment\n4. E-commerce — Recommendation engines and personalization\n5. Automotive — Autonomous vehicles and smart transportation systems\n6. Telecommunications — Network optimization and customer support automation";
    }
    if (lowerText.includes("linkedin")) {
      return "Tips for improving your LinkedIn profile:\n\n1. Have a professional and clear profile picture\n2. Write a strong headline that highlights your expertise and value\n3. Craft a compelling summary with your skills, experience, and career goals\n4. List your key achievements and quantify them where possible\n5. Collect recommendations from colleagues and mentors\n6. Engage with content relevant to your industry to build your network";
    }
    if (lowerText.includes("programming languages")) {
      return "Programming languages in high demand:\n\n1. Python — For data science, machine learning, and web development\n2. JavaScript — For frontend and backend web development\n3. Java — For enterprise applications and Android development\n4. Go — For high-performance backend systems\n5. TypeScript — For scalable web applications\n6. Rust — For systems programming and performance-critical applications";
    }
    if (lowerText.includes("transition to technical")) {
      return "To transition from a non-technical role to a technical role:\n\n1. Start by learning programming basics (e.g., Python, JavaScript)\n2. Take online courses or bootcamps to build foundational knowledge\n3. Work on personal projects to gain hands-on experience\n4. Participate in coding challenges and hackathons to build a portfolio\n5. Network with professionals in the field and seek mentorship\n6. Apply for junior or entry-level positions to gain industry experience";
    }
    if (lowerText.includes("tech portfolio")) {
      return "To impress employers with your tech portfolio:\n\n1. Include a variety of projects showcasing your skills\n2. Provide clear documentation for each project (e.g., README files)\n3. Demonstrate problem-solving abilities and your approach to challenges\n4. Include links to your GitHub or any other code repositories\n5. Show your knowledge of version control (e.g., Git)\n6. Make your portfolio easy to navigate and professional";
    }
    if (lowerText.includes("networking")) {
      return "Best ways to network in the tech industry:\n\n1. Attend industry conferences, meetups, and webinars\n2. Participate in online communities like GitHub, Stack Overflow, or Reddit\n3. Connect with professionals on LinkedIn and engage with their content\n4. Join specialized forums and groups related to your area of interest\n5. Collaborate on open-source projects to build relationships\n6. Reach out for informational interviews to learn about others' careers";
    }
    if (lowerText.includes("remote jobs")) {
      return "Best way to apply for remote tech jobs:\n\n1. Use job boards that specialize in remote work (e.g., We Work Remotely, Remote OK)\n2. Tailor your resume and cover letter to emphasize your remote work experience\n3. Highlight your communication and time management skills\n4. Demonstrate your ability to work independently and manage projects\n5. Network with people in remote-first companies to get referrals\n6. Prepare for remote interview settings (e.g., video calls, virtual collaboration tools)";
    }
    if (lowerText.includes("career gap")) {
      return "Tips for explaining a career gap in interviews:\n\n1. Be honest about the reason for the gap and emphasize what you learned during the time\n2. If you were upskilling, mention any courses or certifications you completed\n3. Highlight any freelance or volunteer work that’s relevant to the job\n4. Show how you’ve stayed up-to-date with industry trends during the gap\n5. Focus on your excitement to get back into the workforce and how you’re ready to contribute";
    }
  
    // Default fallback response if no patterns match
    return "I'm here to help with your job search and career questions. You can ask me about:\n• Job recommendations based on your skills\n• Resume and cover letter tips\n• Interview preparation\n• Skill development advice\n• Salary negotiation\n\nWhat would you like to know more about?";
  };
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Get bot response
      const response = await generateMockBotResponse(input);
      
      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Handle error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error processing your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-job-primary">AI Job Assistant</h1>
          <p className="text-gray-500">Get personalized career advice and job search help</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Sidebar with suggestions */}
  <div className="hidden md:block">
    <Card className="p-4 h-[calc(80vh-1.5rem)]">
      <h3 className="font-medium mb-3">Suggested Questions</h3>
      
      {/* Dynamically generated suggestion buttons */}
      <div className="space-y-2">
      {[
          { text: "How can I improve my resume?", query: "How can I improve my resume?" },
          { text: "What jobs match my skills?", query: "What jobs would you recommend based on my skills?" },
          { text: "How to prepare for interviews?", query: "How should I prepare for job interviews?" },
          { text: "Help me negotiate salary", query: "How should I negotiate my salary?" },
          { text: "What skills should I learn next?", query: "What skills should I learn to advance my career?" },
          { text: "What is a cover letter?", query: "Can you explain the purpose of a cover letter?" },
          { text: "How to work remotely effectively?", query: "What are some tips for working from home?" },
          { text: "How to handle burnout?", query: "What are some strategies to avoid burnout?" },
          { text: "What career paths are there for someone with Python skills?", query: "Tell me about career options for someone with Python skills." },
          { text: "What are the best tech certifications?", query: "What tech certifications would help me advance my career?" },
        ].map((suggestion, index) => (
          <SuggestionButton
            key={index}
            text={suggestion.text}
            onClick={() => {
              setInput(suggestion.query);
            }}
          />
        ))}
      </div>
      
      {/* Dynamically generated user skill buttons */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">Your Skills</h3>
        <div className="flex flex-wrap gap-1">
          {user.skills.map((skill) => (
            <Button
              key={skill}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setInput(`Tell me about career options for someone with ${skill} skills`);
              }}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Chat area */}
          <div className="md:col-span-2">
            <Card className="flex flex-col h-[calc(80vh-1.5rem)]">
              <ScrollArea className="flex-grow p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start">
                      <div className="bg-job-accent text-white rounded-lg py-2 px-4 max-w-[80%]">
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex space-x-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={handleInputKeyDown}
                    disabled={isLoading}
                    className="flex-grow"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-job-primary hover:bg-job-secondary"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                
                <div className="mt-2 md:hidden flex overflow-x-auto space-x-2 pb-2">
                  <SuggestionButton 
                    text="Resume tips" 
                    onClick={() => {
                      setInput("How can I improve my resume?");
                    }} 
                  />
                  <SuggestionButton 
                    text="Job matches" 
                    onClick={() => {
                      setInput("What jobs match my skills?");
                    }} 
                  />
                  <SuggestionButton 
                    text="Interview prep" 
                    onClick={() => {
                      setInput("Interview preparation tips");
                    }} 
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === "bot";
  
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`rounded-lg py-2 px-4 max-w-[80%] ${
          isBot
            ? "bg-job-accent text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <div className="whitespace-pre-line">{message.text}</div>
        <div className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

interface SuggestionButtonProps {
  text: string;
  onClick: () => void;
}

const SuggestionButton: React.FC<SuggestionButtonProps> = ({ text, onClick }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start text-left"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default ChatbotPage;