<template>
    <dialog ref="modal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">Confirm Delete</h3>

            <div class="alert alert-warning mb-4">
                <ExclamationTriangleIcon class="h-6 w-6" />
                <span>This action cannot be undone!</span>
            </div>

            <p class="mb-4">
                Are you sure you want to delete this task? All information
                associated with this task will be permanently removed.
            </p>

            <div class="modal-action">
                <button
                    class="btn btn-ghost"
                    @click="closeModal"
                    :disabled="isLoading"
                >
                    Cancel
                </button>
                <button
                    class="btn btn-error"
                    @click="handleConfirm"
                    :class="{ 'btn-disabled': isLoading }"
                    :disabled="isLoading"
                >
                    <span
                        v-if="isLoading"
                        class="loading loading-spinner"
                    ></span>
                    {{ isLoading ? "Deleting..." : "Delete" }}
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
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

defineProps({
    isLoading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["confirm", "close"]);

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

const handleConfirm = () => {
    emit("confirm");
};

defineExpose({
    openModal,
    closeModal,
});
</script>
