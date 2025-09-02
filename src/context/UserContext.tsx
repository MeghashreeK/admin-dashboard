import { createContext } from "react";
import type { User } from "../types";

export type UserContextValue = {
  users: User[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  fetchUsers: (opts?: { query?: string; page?: number; pageSize?: number }) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
};

export const UserContext = createContext<UserContextValue | undefined>(undefined);