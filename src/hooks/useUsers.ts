import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUsers must be used inside UserProvider");
  return ctx;
};