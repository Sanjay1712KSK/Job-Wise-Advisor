
import React from "react";
import NavBar from "./NavBar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      <main className={cn("flex-1 container mx-auto px-4 py-6", className)}>
        {children}
      </main>
      <footer className="bg-job-primary text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-lg">JobWise</h3>
              <p className="text-sm text-gray-300">Find your perfect job match</p>
            </div>
            <div className="text-xs text-gray-300">
              &copy; {new Date().getFullYear()} JobWise Advisor. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
