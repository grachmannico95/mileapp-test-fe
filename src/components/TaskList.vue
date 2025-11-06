<template>
    <div class="space-y-6">
        <!-- Filters Section -->
        <div class="card bg-base-100 shadow-md">
            <div class="card-body">
                <h3 class="card-title text-lg">Filters</h3>

                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <!-- Search -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Search</span>
                        </label>
                        <input
                            v-model="filters.search"
                            type="text"
                            placeholder="Search tasks..."
                            class="input input-bordered input-sm"
                            @input="debouncedSearch"
                        />
                    </div>

                    <!-- Status Filter -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Status</span>
                        </label>
                        <select
                            v-model="filters.status"
                            class="select select-bordered select-sm"
                            @change="applyFilters"
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <!-- Priority Filter -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Priority</span>
                        </label>
                        <select
                            v-model="filters.priority"
                            class="select select-bordered select-sm"
                            @change="applyFilters"
                        >
                            <option value="">All</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <!-- Sort By -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Sort By</span>
                        </label>
                        <select
                            v-model="filters.sort_by"
                            class="select select-bordered select-sm"
                            @change="applyFilters"
                        >
                            <option value="created_at">Created At</option>
                            <option value="updated_at">Updated At</option>
                            <option value="due_date">Due Date</option>
                            <option value="priority">Priority</option>
                            <option value="title">Title</option>
                        </select>
                    </div>

                    <!-- Due Date From -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Due Date From</span>
                        </label>
                        <input
                            v-model="filters.due_date_from"
                            type="date"
                            class="input input-bordered input-sm"
                            @change="applyFilters"
                        />
                    </div>

                    <!-- Due Date To -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Due Date To</span>
                        </label>
                        <input
                            v-model="filters.due_date_to"
                            type="date"
                            class="input input-bordered input-sm"
                            @change="applyFilters"
                        />
                    </div>

                    <!-- Sort Order -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Sort Order</span>
                        </label>
                        <select
                            v-model="filters.sort_order"
                            class="select select-bordered select-sm"
                            @change="applyFilters"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>

                    <!-- Reset Button -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">&nbsp;</span>
                        </label>
                        <button
                            @click="resetFilters"
                            class="btn btn-outline btn-sm w-full"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tasks List -->
        <div v-if="isLoading" class="flex justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="tasks.length === 0" class="card bg-base-100 shadow-md">
            <div class="card-body items-center text-center py-12">
                <RectangleStackIcon class="h-24 w-24" />
                <h3 class="text-xl font-semibold mb-2">No tasks found</h3>
                <p class="text-base-content/70">
                    Create your first task to get started
                </p>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 gap-4">
            <div
                v-for="task in tasks"
                :key="task.id"
                class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                @click="$emit('view-task', task.id)"
            >
                <div class="card-body">
                    <div class="flex justify-between items-start">
                        <h3 class="card-title text-lg">{{ task.title }}</h3>
                        <div class="flex gap-2">
                            <!-- Status Badge -->
                            <div
                                class="badge"
                                :class="{
                                    'badge-warning': task.status === 'pending',
                                    'badge-info': task.status === 'in_progress',
                                    'badge-success':
                                        task.status === 'completed',
                                }"
                            >
                                {{ formatStatus(task.status) }}
                            </div>
                            <!-- Priority Badge -->
                            <div
                                class="badge"
                                :class="{
                                    'badge-ghost': task.priority === 'low',
                                    'badge-warning': task.priority === 'medium',
                                    'badge-error': task.priority === 'high',
                                }"
                            >
                                {{ task.priority }}
                            </div>
                        </div>
                    </div>

                    <p class="text-base-content/70 text-sm">
                        {{ task.description || "No description" }}
                    </p>

                    <div class="flex justify-between items-center">
                        <div class="text-sm text-base-content/60">
                            Due: {{ formatDate(task.due_date) }}
                        </div>
                        <div class="card-actions">
                            <button
                                @click.stop="$emit('edit-task', task)"
                                class="btn btn-sm btn-ghost"
                            >
                                Edit
                            </button>
                            <button
                                @click.stop="$emit('delete-task', task.id)"
                                class="btn btn-sm btn-error btn-ghost"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="meta.total > 0" class="flex justify-center mt-6">
            <div class="join">
                <button
                    class="join-item btn btn-sm"
                    :disabled="meta.page === 1"
                    @click="changePage(meta.page - 1)"
                >
                    «
                </button>
                <button class="join-item btn btn-sm">
                    Page {{ meta.page }} of {{ meta.total_pages }}
                </button>
                <button
                    class="join-item btn btn-sm"
                    :disabled="meta.page === meta.total_pages"
                    @click="changePage(meta.page + 1)"
                >
                    »
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { RectangleStackIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
    tasks: {
        type: Array,
        required: true,
    },
    meta: {
        type: Object,
        required: true,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits([
    "filter-change",
    "view-task",
    "edit-task",
    "delete-task",
]);

const filters = reactive({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    priority: "",
    due_date_from: "",
    due_date_to: "",
    sort_by: "created_at",
    sort_order: "desc",
});

let debounceTimer = null;

const debouncedSearch = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        applyFilters();
    }, 500);
};

const applyFilters = () => {
    filters.page = 1;
    emit("filter-change", { ...filters });
};

const resetFilters = () => {
    filters.search = "";
    filters.status = "";
    filters.priority = "";
    filters.due_date_from = "";
    filters.due_date_to = "";
    filters.sort_by = "created_at";
    filters.sort_order = "desc";
    filters.page = 1;
    applyFilters();
};

const changePage = (page) => {
    filters.page = page;
    emit("filter-change", { ...filters });
};

const formatStatus = (status) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
    });
};

watch(
    () => props.meta,
    () => {},
    { immediate: true },
);
</script>
