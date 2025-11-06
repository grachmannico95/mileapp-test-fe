<template>
    <dialog ref="modal" class="modal">
        <div class="modal-box max-w-2xl">
            <h3 class="font-bold text-lg mb-6">Task Details</h3>

            <div v-if="isLoading" class="flex justify-center py-12">
                <span class="loading loading-spinner loading-lg"></span>
            </div>

            <div v-else-if="task" class="space-y-4">
                <!-- Title -->
                <div>
                    <label class="text-sm font-semibold text-base-content/70"
                        >Title</label
                    >
                    <p class="text-lg mt-1">{{ task.title }}</p>
                </div>

                <!-- Description -->
                <div>
                    <label class="text-sm font-semibold text-base-content/70"
                        >Description</label
                    >
                    <p class="mt-1 whitespace-pre-wrap">
                        {{ task.description || "No description" }}
                    </p>
                </div>

                <!-- Status and Priority -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            class="text-sm font-semibold text-base-content/70"
                            >Status</label
                        >
                        <div class="mt-1">
                            <div
                                class="badge badge-lg"
                                :class="{
                                    'badge-warning': task.status === 'pending',
                                    'badge-info': task.status === 'in_progress',
                                    'badge-success':
                                        task.status === 'completed',
                                }"
                            >
                                {{ formatStatus(task.status) }}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label
                            class="text-sm font-semibold text-base-content/70"
                            >Priority</label
                        >
                        <div class="mt-1">
                            <div
                                class="badge badge-lg"
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
                </div>

                <!-- Due Date -->
                <div>
                    <label class="text-sm font-semibold text-base-content/70"
                        >Due Date</label
                    >
                    <p class="mt-1">{{ formatDate(task.due_date) }}</p>
                </div>

                <!-- Timestamps -->
                <div class="divider"></div>
                <div
                    class="grid grid-cols-2 gap-4 text-sm text-base-content/60"
                >
                    <div>
                        <label class="font-semibold">Created At</label>
                        <p>{{ formatDateTime(task.created_at) }}</p>
                    </div>
                    <div>
                        <label class="font-semibold">Updated At</label>
                        <p>{{ formatDateTime(task.updated_at) }}</p>
                    </div>
                </div>
            </div>

            <!-- Modal Actions -->
            <div class="modal-action">
                <button class="btn btn-ghost" @click="closeModal">Close</button>
                <button class="btn btn-primary" @click="handleEdit">
                    Edit
                </button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="closeModal">close</button>
        </form>
    </dialog>
</template>

<script setup>
import { ref } from "vue";

defineProps({
    task: {
        type: Object,
        default: null,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["edit", "close"]);

const modal = ref(null);

const openModal = () => {
    if (modal.value) {
        modal.value.showModal();
    }
};

const closeModal = () => {
    if (modal.value) {
        modal.value.close();
    }
    emit("close");
};

const handleEdit = () => {
    emit("edit");
    closeModal();
};

const formatStatus = (status) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
    });
};

defineExpose({
    openModal,
    closeModal,
});
</script>
