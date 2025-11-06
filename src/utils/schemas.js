import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

// Task validation schema
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .optional()
    .default(''),
  status: z
    .enum(['pending', 'in_progress', 'completed'], {
      errorMap: () => ({ message: 'Status must be pending, in_progress, or completed' })
    })
    .default('pending'),
  priority: z
    .enum(['low', 'medium', 'high'], {
      errorMap: () => ({ message: 'Priority must be low, medium, or high' })
    })
    .default('low'),
  due_date: z
    .string()
    .refine((date) => {
      if (!date) return false;
      return !isNaN(Date.parse(date));
    }, 'Invalid date format')
    .optional(),
});
