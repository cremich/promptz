"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserViewModel } from "@/models/UserViewModel";
import { signOut, getCurrentUser } from "aws-amplify/auth";
import { UserGraphQLRepository } from "@/repositories/UserRepository";

interface AuthContextType {
  user: UserViewModel | null;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const userRepository = new UserGraphQLRepository();
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserViewModel | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const currentUser = await getCurrentUser();
      const user = await userRepository.getUser(currentUser.userId);
      setUser(user);
    } catch {
      setUser(UserViewModel.createGuest());
    }
  }

  async function logout() {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setUser(UserViewModel.createGuest());
    }
  }

  return (
    <AuthContext.Provider value={{ user, logout, fetchUser }}>
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
