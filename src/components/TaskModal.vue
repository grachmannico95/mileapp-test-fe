<template>
    <dialog ref="modal" class="modal">
        <div class="modal-box max-w-2xl">
            <h3 class="font-bold text-lg mb-4">
                {{ isEditMode ? "Edit Task" : "Create New Task" }}
            </h3>

            <!-- Error Alert -->
            <div v-if="serverError" class="alert alert-error mb-4">
                <ExclamationCircleIcon class="h-6 w-6" />
                <span>{{ serverError }}</span>
            </div>

            <form @submit="onSubmit">
                <!-- Title Field -->
                <div class="form-control w-full mb-4">
                    <label class="label">
                        <span class="label-text">Title *</span>
                    </label>
                    <input
                        v-model="title"
                        type="text"
                        placeholder="Enter task title"
                        class="input input-bordered w-full"
                        :class="{ 'input-error': errors.title }"
                    />
                    <label v-if="errors.title" class="label">
                        <span class="label-text-alt text-error text-sm">{{
                            errors.title
                        }}</span>
                    </label>
                </div>

                <!-- Description Field -->
                <div class="form-control w-full mb-4">
                    <label class="label">
                        <span class="label-text">Description</span>
                    </label>
                    <textarea
                        v-model="description"
                        placeholder="Enter task description"
                        class="textarea textarea-bordered h-24 w-full"
                        :class="{ 'textarea-error': errors.description }"
                    ></textarea>
                    <label v-if="errors.description" class="label">
                        <span class="label-text-alt text-error text-sm">{{
                            errors.description
                        }}</span>
                    </label>
                </div>

                <!-- Status and Priority -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <!-- Status Field -->
                    <div class="form-control w-full">
                        <label class="label">
                            <span class="label-text">Status</span>
                        </label>
                        <select
                            v-model="status"
                            class="select select-bordered"
                            :class="{ 'select-error': errors.status }"
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <label v-if="errors.status" class="label">
                            <span class="label-text-alt text-error text-sm">{{
                                errors.status
                            }}</span>
                        </label>
                    </div>

                    <!-- Priority Field -->
                    <div class="form-control w-full">
                        <label class="label">
                            <span class="label-text">Priority</span>
                        </label>
                        <select
                            v-model="priority"
                            class="select select-bordered"
                            :class="{ 'select-error': errors.priority }"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <label v-if="errors.priority" class="label">
                            <span class="label-text-alt text-error text-sm">{{
                                errors.priority
                            }}</span>
                        </label>
                    </div>
                </div>

                <!-- Due Date Field -->
                <div class="form-control w-full mb-6">
                    <label class="label">
                        <span class="label-text">Due Date</span>
                    </label>
                    <input
                        v-model="due_date"
                        type="datetime-local"
                        class="input input-bordered w-full"
                        :class="{ 'input-error': errors.due_date }"
                        :min="!isEditMode ? getDefaultDueDate() : null"
                    />
                    <label v-if="errors.due_date" class="label">
                        <span class="label-text-alt text-error text-sm">{{
                            errors.due_date
                        }}</span>
                    </label>
                </div>

                <!-- Modal Actions -->
                <div class="modal-action">
                    <button
                        type="button"
                        class="btn btn-ghost"
                        @click="closeModal"
                        :disabled="isLoading"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :class="{ 'btn-disabled': isLoading }"
                        :disabled="isLoading"
                    >
                        <span
                            v-if="isLoading"
                            class="loading loading-spinner"
                        ></span>
                        {{ isLoading ? "Saving..." : "Save" }}
                    </button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="closeModal">close</button>
        </form>
    </dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { taskSchema } from "../utils/schemas";
import { ExclamationCircleIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
    task: {
        type: Object,
        default: null,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["submit", "close"]);

const modal = ref(null);
const serverError = ref(null);
const isEditMode = ref(false);

const { errors, handleSubmit, defineField, resetForm, setValues } = useForm({
    validationSchema: toTypedSchema(taskSchema),
    initialValues: {
        title: "",
        description: "",
        status: "pending",
        priority: "low",
        due_date: "",
    },
});

const [title] = defineField("title");
const [description] = defineField("description");
const [status] = defineField("status");
const [priority] = defineField("priority");
const [due_date] = defineField("due_date");

const getDefaultDueDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);

    // Format for datetime-local input (YYYY-MM-DDTHH:mm)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minute}`;
};

watch(
    () => props.task,
    (newTask) => {
        if (newTask) {
            isEditMode.value = true;

            let formattedDueDate = "";
            if (newTask.due_date) {
                const date = new Date(
                    new Date(newTask.due_date).toLocaleString("en-US", {
                        timeZone: "Asia/Jakarta",
                    }),
                );
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const hour = String(date.getHours()).padStart(2, "0");
                const minute = String(date.getMinutes()).padStart(2, "0");

                formattedDueDate = `${year}-${month}-${day}T${hour}:${minute}`;
            }

            setValues({
                title: newTask.title,
                description: newTask.description || "",
                status: newTask.status,
                priority: newTask.priority,
                due_date: formattedDueDate,
            });
        } else {
            isEditMode.value = false;
            resetForm();
        }
    },
);

const onSubmit = handleSubmit(async (values) => {
    serverError.value = null;

    const taskData = {
        ...values,
        due_date: values.due_date
            ? new Date(values.due_date).toISOString()
            : undefined,
    };

    emit("submit", taskData);
});

const openModal = () => {
    if (modal.value) {
        modal.value.showModal();
    }
};

const closeModal = () => {
    if (modal.value) {
        modal.value.close();
    }
    resetForm();
    serverError.value = null;
    emit("close");
};

defineExpose({
    openModal,
    closeModal,
    setServerError: (error) => {
        serverError.value = error;
    },
});
</script>
