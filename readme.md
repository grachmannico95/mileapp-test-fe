# MileApp Test Frontend

This project is a Vue 3 task management frontend that integrates with a Golang REST API backend. It provides a full-featured interface for authentication and task CRUD operations, built using modern Vue 3 Composition API, VeeValidate, Zod, and DaisyUI for responsive, accessible, and consistent UI design.

## Overview
A Vue 3 single-page application (SPA) with:
- User login/logout via cookies and CSRF protection
- Protected task management dashboard (create, edit, delete, view tasks)
- Filtering, sorting, pagination, and search for tasks
- Dynamic modals for task details, forms, and delete confirmations
- Responsive UI built with DaisyUI + TailwindCSS

## Design Decision
- Composables Pattern: Core logic (auth, tasks) abstracted into reusable hooks under /composables for better reusability
- Vue Router Guards: Automatically protect routes based on authentication state, redirecting unauthenticated users to /login
- Cookie-Based Authentication: Relies on secure access_token and csrf_token cookies provided by the backend, ensuring tight integration with the Go API

## Strengths of the Module
- Secure Authentication Flow: Manages login/logout using backend-issued cookies and automatic CSRF token handling
- Error Resilience: Handles failed API calls gracefully with fallback navigation and error messaging

### Setup
- install node package
  ```
  npm install
  ```
- create .env file
  ```
  cp .env.example .env
  ```

### How to run
```
npm run dev
```

### How to build
```
npm run dev
```
