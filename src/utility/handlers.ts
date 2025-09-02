import { usersSeed } from "./data";
import type { User } from "../types";
import { http, HttpResponse } from "msw";

const users: User[] = [...usersSeed];


export const handlers = [
 http.get("/api/users", ({ request }) => {
       const url = new URL(request.url);
    const query = url.searchParams.get("query") || "";
    const status = url.searchParams.get("status") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Number(url.searchParams.get("pageSize") || "10");


let filtered = users.slice();
if (query) {
const q = query.toLowerCase();
filtered = filtered.filter((u) => u.name.toLowerCase().includes(q));
}
if (status) {
filtered = filtered.filter((u) => u.status === status);
}


const totalCount = filtered.length;
const start = (page - 1) * pageSize;
const paged = filtered.slice(start, start + pageSize);


return HttpResponse.json(
      { data: { totalCount, users: paged } },
      { status: 200 }
    );
  }),

  http.patch("/api/users/:id", async ({ request, params }) => {
  const { id } = params as { id: string };
    const body = await request.json().catch(() => ({}));
    const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }

const newStatus = ((body as { status?: "active" | "inactive" })?.status) || (users[userIndex].status === "active" ? "inactive" : "active");

users[userIndex] = { ...users[userIndex], status: newStatus };


  return HttpResponse.json(
      { data: users[userIndex] },
      { status: 200 }
    );
  }),
];