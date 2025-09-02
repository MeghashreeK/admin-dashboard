import React, { useEffect, useState } from "react";
import type { User } from "../types";
import * as userApi from "../api/userApi";
import useCustomSnackbar from "../hooks/useCustomSnackbar";
import { UserContext, type UserContextValue } from "./UserContext";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showSnackbar = useCustomSnackbar();

  const fetchUsers = async (opts?: { query?: string; page?: number; pageSize?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getUsers({ query: opts?.query, page: opts?.page || 1, pageSize: opts?.pageSize || 10 });
      setUsers(res.data.users);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load";
      setError(errorMessage);
      showSnackbar("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({ page: 1, pageSize: 10 });
  }, []);

  const toggleStatus = async (id: string) => {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return;

    const old = users[idx];
    const newStatus = old.status === "active" ? "inactive" : "active";
    const updated = [...users];
    updated[idx] = { ...old, status: newStatus };
    setUsers(updated);

    try {
      const res = await userApi.patchUserStatus(id, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === id ? res : u)));
      showSnackbar(`User ${res.name} is now ${res.status}`, "success");
    } catch (err) {
      console.log(err);
      setUsers((prev) => prev.map((u) => (u.id === id ? old : u)));
      showSnackbar("Failed to update user status", "error");
    }
  };

  const value: UserContextValue = {
    users,
    totalCount,
    loading,
    error,
    fetchUsers,
    toggleStatus,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};