
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, LogOut, User, LogIn, Plus, Home } from "lucide-react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-brand-orange" />
            <span className="text-xl font-bold text-brand-darkgray">PotholeFix</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <img 
                    src={user?.avatarUrl || "https://i.pravatar.cc/150?img=0"}
                    alt={user?.username || "User"}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="font-medium hidden md:inline">{user?.username}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => logout()}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  <LogIn className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline">Login</span>
                </Button>
                <Button variant="default" className="bg-brand-blue hover:bg-blue-600" onClick={() => navigate("/signup")}>
                  <User className="h-5 w-5 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Sign Up</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {isAuthenticated && (
        <div className="fixed bottom-6 right-6">
          <Button 
            className="rounded-full h-14 w-14 bg-brand-blue hover:bg-blue-600 shadow-lg"
            onClick={() => navigate("/report/new")}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      <footer className="bg-brand-lightgray py-4">
        <div className="container mx-auto px-4 text-center text-brand-darkgray text-sm">
          <p>© 2025 PotholeFix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
