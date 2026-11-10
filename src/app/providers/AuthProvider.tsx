import { createContext, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Role, User } from "@/types/auth";

const STORAGE_KEY = "travel-admin-role";

const demoUsers: Record<Role, User> = {
  super_admin: { id: "u1", name: "Alex Morgan", email: "alex@travel.test", role: "super_admin" },
  admin: { id: "u2", name: "Jordan Lee", email: "jordan@travel.test", role: "admin" },
  manager: { id: "u3", name: "Sam Rivera", email: "sam@travel.test", role: "manager" },
  staff: { id: "u4", name: "Casey Park", email: "casey@travel.test", role: "staff" },
};

interface AuthContextValue {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredRole(): Role | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Role | null;
    return stored && stored in demoUsers ? stored : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Signed out until someone logs in. The role is remembered across reloads.
  const [role, setRole] = useState<Role | null>(() => readStoredRole());

  const login = useCallback((next: Role) => {
    localStorage.setItem(STORAGE_KEY, next);
    setRole(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({ user: role ? demoUsers[role] : null, login, logout }),
    [role, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}