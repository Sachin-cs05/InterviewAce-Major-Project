import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Please provide a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .refine(
        (val) => Buffer.byteLength(val, 'utf8') <= 72,
        'Password cannot exceed 72 bytes'
      ),
    confirmPassword: z.string().optional(),
    targetRole: z.string().trim().max(100).optional(),
    experience: z.string().trim().max(50).optional(),
    skills: z.array(z.string().trim().max(50)).max(50).optional(),
    education: z.string().trim().max(200).optional(),
  })
  .refine(
    (data) => !data.confirmPassword || data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});
