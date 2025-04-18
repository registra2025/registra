// middleware/auth.js
import { getAuth } from "firebase/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const adminEmail = "admin@registra.com";

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/about",
    "/contact",
    "/faq",
    "/pricing"
  ];

  // Routes that require admin access
  const adminRoutes = [
    "/dashboard-admin",
    "/inventory",
    "/performance",
    "/stock-record",
    "/sales",
    "/sales-receipt"
  ];

  // Routes that require regular user authentication
  const authRoutes = [
    "/dashboard",
    "/cart",
    "/purchase-receipt",
    "/scan",
    "/scan-pr"
  ];

  // If not logged in and not on a public route, redirect to login
  if (!user && !publicRoutes.includes(to.path)) {
    return navigateTo("/login");
  }

  // If logged in but not admin and trying to access admin route
  if (user && user.email !== adminEmail && adminRoutes.includes(to.path)) {
    return navigateTo("/403");
  }

  // Otherwise, allow navigation
  // No return means navigation continues
});


