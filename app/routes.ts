import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Public routes
  index("pages/login.tsx"), 
  
  // Protected routes
  route("dashboard", "pages/dashboard.tsx"),
  route("profil", "pages/profil.tsx"),
  
  // Fallback route (404)
  route("*", "pages/notfound.tsx"),
] satisfies RouteConfig;