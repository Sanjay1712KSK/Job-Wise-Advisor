
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Send, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const AIChatPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleSendMessage = async () => {
    if (!input.trim()) return;
  
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Together.ai API key to continue.",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);

  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.2", // Together.ai model
        messages: [
          { role: "system", content: "You are a helpful career advisor specializing in tech jobs. Provide concise, practical advice." },
          { role: "user", content: input },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to get response");
    }


      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.choices[0].message.content.trim(),
        sender: "bot",
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-job-primary">AI Career Assistant</h1>
          <p className="text-gray-500">Get personalized career advice powered by OpenAI</p>
        </div>

        <Card className="p-4">
          <Label htmlFor="apiKey">Together.ai API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Together.ai API key"
            className="mb-4"
          />
          <p className="text-sm text-gray-500 mb-4">
            Your API key is stored locally and never sent to our servers.
          </p>
        </Card>

        <Card className="flex flex-col h-[60vh]">
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`rounded-lg py-2 px-4 max-w-[80%] ${
                      message.sender === "bot"
                        ? "bg-job-accent text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.sender === "bot" && (
                      <Bot className="h-4 w-4 mb-1 inline-block mr-2" />
                    )}
                    <div className="inline">{message.text}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-job-accent text-white rounded-lg py-2 px-4">
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
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-job-primary hover:bg-job-secondary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AIChatPage;
