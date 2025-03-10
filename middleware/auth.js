import { getAuth, onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  return new Promise((resolve) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user && to.path !== "/login") {
        return navigateTo("/login");
      }
      resolve(true);
    });
  });
});
