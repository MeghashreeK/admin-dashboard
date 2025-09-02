import type { User } from "../types";


export type GetUsersResponse = { data: { totalCount: number; users: User[] } };


export const getUsers = async (params?: { query?: string; status?: string; page?: number; pageSize?: number }) => {
const qs = new URLSearchParams();
if (params?.query) qs.set("query", params.query);
if (params?.status) qs.set("status", params.status);
if (params?.page) qs.set("page", String(params.page));
if (params?.pageSize) qs.set("pageSize", String(params.pageSize));


const res = await fetch(`/api/users?${qs.toString()}`);
if (!res.ok) throw new Error("Failed to fetch users");
return (await res.json()) as GetUsersResponse;
};


export const patchUserStatus = async (id: string, status: "active" | "inactive") => {
const res = await fetch(`/api/users/${id}`, {
method: "PATCH",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ status }),
});
if (!res.ok) throw new Error("Failed to update user");
const json = await res.json();
return json.data as User;
};