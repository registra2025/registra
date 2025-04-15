// middleware/auth.js
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  return new Promise((resolve) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      const adminEmail = "admin@registra.com";

      const adminRoutes = [
        "/inventory",
        "/performance",
        "/stock-record",
        "/purchase-receipt"
      ];

      if (!user && to.path !== "/login") {
        return navigateTo("/login");
      }

      if (user && user.email !== adminEmail && adminRoutes.includes(to.path)) {
        return navigateTo("/403"); // Or a "not authorized" page
      }

      resolve(true);
    });
  });
});
