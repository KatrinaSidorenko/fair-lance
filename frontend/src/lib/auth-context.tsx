"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, UserResponse } from "./api";
import { getAuthToken, removeAuthToken, setAuthToken } from "./auth";

export type UserRole = "employer" | "freelancer" | "admin";

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getRoleName(roleId: number): UserRole {
  switch (roleId) {
    case 1:
      return "employer";
    case 2:
      return "freelancer";
    case 3:
      return "admin";
    default:
      return "freelancer";
  }
}

export function getRoleDisplayName(roleId: number): string {
  switch (roleId) {
    case 1:
      return "Employer";
    case 2:
      return "Freelancer";
    case 3:
      return "Admin";
    default:
      return "Unknown";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await api.getMe();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (token: string) => {
    setAuthToken(token);
    await refreshUser();
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    window.location.href = "/login";
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    userRole: user ? getRoleName(user.role_id) : null,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// HOC for protecting routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles?: UserRole[]
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, userRole } = useAuth();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = "/login";
      }
      if (
        !isLoading &&
        isAuthenticated &&
        allowedRoles &&
        userRole &&
        !allowedRoles.includes(userRole)
      ) {
        window.location.href = "/dashboard";
      }
    }, [isLoading, isAuthenticated, userRole]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
