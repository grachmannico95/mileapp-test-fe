<template>
    <div class="min-h-screen bg-base-200">
        <!-- Navbar -->
        <Navbar />

        <!-- Main Content -->
        <div class="container mx-auto px-4 py-8">
            <!-- Header with Create Button -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold">Tasks</h1>
                <button @click="handleCreateTask" class="btn btn-primary">
                    <PlusIcon class="h-6 w-6" />
                    Create Task
                </button>
            </div>

            <!-- Success Toast -->
            <div v-if="successMessage" class="toast toast-top toast-end">
                <div class="alert alert-success">
                    <CheckIcon class="h-6 w-6" />
                    <span>{{ successMessage }}</span>
                </div>
            </div>

            <!-- Error Toast -->
            <div v-if="errorMessage" class="toast toast-top toast-end">
                <div class="alert alert-error">
                    <ExclamationCircleIcon class="h-6 w-6" />
                    <span>{{ errorMessage }}</span>
                </div>
            </div>

            <!-- Task List -->
            <TaskList
                :tasks="tasks"
                :meta="meta"
                :is-loading="isLoading"
                @filter-change="handleFilterChange"
                @view-task="handleViewTask"
                @edit-task="handleEditTask"
                @delete-task="handleDeleteTask"
            />
        </div>

        <!-- Modals -->
        <TaskModal
            ref="taskModal"
            :task="selectedTask"
            :is-loading="isSubmitting"
            @submit="handleTaskSubmit"
            @close="handleModalClose"
        />

        <TaskDetailModal
            ref="taskDetailModal"
            :task="currentTask"
            :is-loading="isLoadingDetail"
            @edit="handleEditFromDetail"
            @close="handleDetailModalClose"
        />

        <DeleteConfirmModal
            ref="deleteModal"
            :is-loading="isDeleting"
            @confirm="handleConfirmDelete"
            @close="handleDeleteModalClose"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import TaskList from "../components/TaskList.vue";
import TaskModal from "../components/TaskModal.vue";
import TaskDetailModal from "../components/TaskDetailModal.vue";
import DeleteConfirmModal from "../components/DeleteConfirmModal.vue";
import { useTask } from "../composables/useTask";
import {
    PlusIcon,
    CheckIcon,
    ExclamationCircleIcon,
} from "@heroicons/vue/24/outline";

const {
    tasks,
    currentTask,
    meta,
    isLoading,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
} = useTask();

const taskModal = ref(null);
const taskDetailModal = ref(null);
const deleteModal = ref(null);

const selectedTask = ref(null);
const taskToDelete = ref(null);
const isSubmitting = ref(false);
const isLoadingDetail = ref(false);
const isDeleting = ref(false);

const successMessage = ref("");
const errorMessage = ref("");

const currentFilters = ref({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
});

onMounted(() => {
    loadTasks();
});

const loadTasks = async () => {
    await fetchTasks(currentFilters.value);
};

const handleFilterChange = (filters) => {
    currentFilters.value = filters;
    loadTasks();
};

const handleCreateTask = () => {
    selectedTask.value = null;
    taskModal.value.openModal();
};

const handleEditTask = (task) => {
    selectedTask.value = task;
    taskModal.value.openModal();
};

const handleViewTask = async (taskId) => {
    isLoadingDetail.value = true;
    taskDetailModal.value.openModal();

    const result = await fetchTaskById(taskId);

    if (!result.success) {
        showError(result.message);
        taskDetailModal.value.closeModal();
    }

    isLoadingDetail.value = false;
};

const handleEditFromDetail = () => {
    selectedTask.value = currentTask.value;
    taskModal.value.openModal();
};

const handleTaskSubmit = async (taskData) => {
    isSubmitting.value = true;

    let result;
    if (selectedTask.value) {
        result = await updateTask(selectedTask.value.id, taskData);
    } else {
        result = await createTask(taskData);
    }

    isSubmitting.value = false;

    if (result.success) {
        showSuccess(
            selectedTask.value
                ? "Task updated successfully"
                : "Task created successfully",
        );
        taskModal.value.closeModal();
        loadTasks();
    } else {
        if (result.errors) {
            taskModal.value.setServerError(result.message);
        } else {
            showError(result.message);
        }
    }
};

const handleDeleteTask = (taskId) => {
    taskToDelete.value = taskId;
    deleteModal.value.openModal();
};

const handleConfirmDelete = async () => {
    if (!taskToDelete.value) return;

    isDeleting.value = true;

    const result = await deleteTask(taskToDelete.value);

    isDeleting.value = false;

    if (result.success) {
        showSuccess("Task deleted successfully");
        deleteModal.value.closeModal();
        loadTasks();
    } else {
        showError(result.message);
    }
};

const handleModalClose = () => {
    selectedTask.value = null;
};

const handleDetailModalClose = () => {
    currentTask.value = null;
};

const handleDeleteModalClose = () => {
    taskToDelete.value = null;
};

const showSuccess = (message) => {
    successMessage.value = message;
    setTimeout(() => {
        successMessage.value = "";
    }, 3000);
};

const showError = (message) => {
    errorMessage.value = message;
    setTimeout(() => {
        errorMessage.value = "";
    }, 3000);
};
</script>
