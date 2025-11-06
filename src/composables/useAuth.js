import { ref, computed } from "vue";
import api from "../services/api";
import { isAuthenticated } from "../utils/cookies";

const user = ref(null);
const isLoading = ref(false);
const error = ref(null);

export function useAuth() {
  const isLoggedIn = computed(() => isAuthenticated());

  const login = async (email, password) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.post("/api/v1/login", {
        email,
        password,
      });

      if (response.data.success) {
        user.value = response.data.data.user;
        return { success: true, user: response.data.data.user };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      const validationErrors = err.response?.data?.errors || null;

      error.value = errorMessage;

      return {
        success: false,
        message: errorMessage,
        errors: validationErrors,
      };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.post("/api/v1/logout");

      if (response.data.success) {
        user.value = null;
        window.location.href = "/login";
        return { success: true, message: response.data.message };
      }

      user.value = null;
      window.location.href = "/login";
      return { success: false, message: response.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Logout failed";
      error.value = errorMessage;

      user.value = null;
      window.location.href = "/login";

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      isLoading.value = false;
    }
  };

  const checkAuth = () => {
    return isAuthenticated();
  };

  return {
    user,
    isLoading,
    error,
    isLoggedIn,
    login,
    logout,
    checkAuth,
  };
}
