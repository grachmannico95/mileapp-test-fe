import { ref } from "vue";
import api from "../services/api";

export function useTask() {
  const tasks = ref([]);
  const currentTask = ref(null);
  const meta = ref({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 0,
  });
  const isLoading = ref(false);
  const error = ref(null);

  const fetchTasks = async (filters = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.search) params.append("search", filters.search);
      if (filters.due_date_from)
        params.append("due_date_from", filters.due_date_from);
      if (filters.due_date_to)
        params.append("due_date_to", filters.due_date_to);
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.sort_order) params.append("sort_order", filters.sort_order);

      const response = await api.get(`/api/v1/tasks?${params.toString()}`);

      if (response.data.success) {
        tasks.value = response.data.data.tasks;
        meta.value = response.data.data.meta;
        return { success: true, data: response.data.data };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch tasks";
      error.value = errorMessage;
      return { success: false, message: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  const fetchTaskById = async (id) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/api/v1/tasks/${id}`);

      if (response.data.success) {
        currentTask.value = response.data.data;
        return { success: true, data: response.data.data };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch task";
      error.value = errorMessage;
      return { success: false, message: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  const createTask = async (taskData) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.post("/api/v1/tasks", taskData);

      if (response.data.success) {
        return { success: true, data: response.data.data };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create task";
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

  const updateTask = async (id, taskData) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.put(`/api/v1/tasks/${id}`, taskData);

      if (response.data.success) {
        return { success: true, data: response.data.data };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update task";
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

  const deleteTask = async (id) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.delete(`/api/v1/tasks/${id}`);

      if (response.data.success) {
        return { success: true, message: response.data.message };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete task";
      error.value = errorMessage;
      return { success: false, message: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    tasks,
    currentTask,
    meta,
    isLoading,
    error,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
  };
}
