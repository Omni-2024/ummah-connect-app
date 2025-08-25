import { proxy } from "valtio";

export const globalState = proxy({
  user: null as null | { id: string; name: string; email: string },
  isAuthenticated: false,
  theme: "light" as "light" | "dark",
  error: null as string | null,
});
