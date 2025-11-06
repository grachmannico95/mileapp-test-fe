import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../utils/cookies";
import LoginView from "../views/LoginView.vue";
import TasksView from "../views/TasksView.vue";

const routes = [
  {
    path: "/",
    redirect: "/tasks",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: "/tasks",
    name: "Tasks",
    component: TasksView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuth = isAuthenticated();

  // Redirect authenticated users away from login page
  if (to.meta.requiresGuest && isAuth) {
    next("/tasks");
    return;
  }

  // Redirect unauthenticated users to login page
  if (to.meta.requiresAuth && !isAuth) {
    next("/login");
    return;
  }

  next();
});

export default router;
