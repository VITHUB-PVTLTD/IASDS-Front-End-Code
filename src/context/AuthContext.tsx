import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

interface UserMeta {
  id: string;
  email: string;
  role: string;
  status: string;
  member: {
    id: string;
    status: string;
    membershipNumber: string | null;
    fullName: string;
    photoUrl: string | null;
  } | null;
}

interface AuthContextType {
  user: UserMeta | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUserMeta: (updatedMemberData: Partial<UserMeta["member"]>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on startup
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    if (storedUser && accessToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user storage data", err);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.post("/auth/login", credentials);
    const { accessToken, refreshToken, user: loggedUser } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch (err) {
      console.error("API logout call failed, cleaning up local storage anyway", err);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUserMeta = (updatedMemberData: any) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      member: user.member ? { ...user.member, ...updatedMemberData } : null
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUserMeta }}>
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
