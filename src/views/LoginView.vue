<template>
    <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div class="card w-full max-w-md bg-base-100 shadow-xl">
            <div class="card-body">
                <h2
                    class="card-title text-3xl font-bold text-center justify-center mb-6"
                >
                    Login
                </h2>

                <!-- Error Alert -->
                <div v-if="serverError" class="alert alert-error mb-4">
                    <ExclamationCircleIcon class="h-6 w-6" />
                    <span>{{ serverError }}</span>
                </div>

                <form @submit="onSubmit">
                    <!-- Email Field -->
                    <div class="form-control w-full mb-4">
                        <label class="label">
                            <span class="label-text">Email</span>
                        </label>
                        <input
                            v-model="email"
                            type="email"
                            placeholder="Enter your email"
                            class="input input-bordered w-full"
                            :class="{ 'input-error': errors.email }"
                        />
                        <label v-if="errors.email" class="label">
                            <span class="label-text-alt text-error">{{
                                errors.email
                            }}</span>
                        </label>
                    </div>

                    <!-- Password Field -->
                    <div class="form-control w-full mb-6">
                        <label class="label">
                            <span class="label-text">Password</span>
                        </label>
                        <input
                            v-model="password"
                            type="password"
                            placeholder="Enter your password"
                            class="input input-bordered w-full"
                            :class="{ 'input-error': errors.password }"
                        />
                        <label v-if="errors.password" class="label">
                            <span class="label-text-alt text-error">{{
                                errors.password
                            }}</span>
                        </label>
                    </div>

                    <!-- Submit Button -->
                    <div class="form-control mt-6">
                        <button
                            type="submit"
                            class="btn btn-primary w-full"
                            :class="{ 'btn-disabled': isLoading }"
                            :disabled="isLoading"
                        >
                            <span
                                v-if="isLoading"
                                class="loading loading-spinner"
                            ></span>
                            {{ isLoading ? "Logging in..." : "Login" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { loginSchema } from "../utils/schemas";
import { useAuth } from "../composables/useAuth";
import { ExclamationCircleIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const { login, isLoading } = useAuth();

const serverError = ref(null);

const { errors, handleSubmit, defineField } = useForm({
    validationSchema: toTypedSchema(loginSchema),
});

const [email] = defineField("email");
const [password] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
    serverError.value = null;

    const result = await login(values.email, values.password);
    if (result.success) {
        router.push("/tasks");
    } else {
        serverError.value = result.message;
        if (result.errors) {
            result.errors.forEach((err) => {
                errors.value[err.field] = err.message;
            });
        }
    }
});
</script>
