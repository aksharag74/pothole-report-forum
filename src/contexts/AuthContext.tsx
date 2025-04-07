
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types";
import { mockUsers } from "@/services/mockData";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is already logged in from local storage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, we'll just check if the email is in our mock users
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      // In a real app, we would also verify the password
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.username}!`,
      });
    } else {
      throw new Error("Invalid email or password");
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    // For demo purposes, we'll just create a new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email,
      username,
      avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };
    
    // In a real app, we would add the user to the database
    setUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    toast({
      title: "Account created",
      description: `Welcome, ${username}!`,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        signup, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
