<template>
    <div class="navbar bg-base-100 shadow-lg">
        <div class="flex-1">
            <a class="btn btn-ghost text-xl">Task Manager</a>
        </div>
        <div class="flex-none gap-2">
            <button
                @click="handleLogout"
                class="btn btn-ghost"
                :class="{ 'btn-disabled': isLoading }"
                :disabled="isLoading"
            >
                <span
                    v-if="isLoading"
                    class="loading loading-spinner loading-sm"
                ></span>
                <ArrowLeftStartOnRectangleIcon class="h-6 w-6" />

                {{ isLoading ? "Logging out..." : "Logout" }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { useAuth } from "../composables/useAuth";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/vue/24/outline";

const { logout, isLoading } = useAuth();

const handleLogout = async () => {
    await logout();
};
</script>
