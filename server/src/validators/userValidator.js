import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name cannot exceed 100 characters')
      .optional(),
    targetRole: z.string().trim().max(100).optional(),
    experience: z.string().trim().max(50).optional(),
    skills: z
      .array(z.string().trim().min(1).max(50))
      .max(50, 'Cannot exceed 50 skills')
      .optional(),
    education: z.string().trim().max(200).optional(),
  })
  .strict('Unrecognized field in profile update');

export const updatePreferencesSchema = z
  .object({
    voiceEnabled: z.boolean().optional(),
    defaultInterviewType: z
      .enum(['Technical', 'HR / General', 'Behavioral', 'Mixed'])
      .optional(),
    defaultDifficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
    defaultQuestionCount: z
      .coerce
      .number()
      .refine((val) => [3, 5, 10].includes(val), {
        message: 'Default question count must be 3, 5, or 10',
      })
      .optional(),
  })
  .strict('Unrecognized field in preferences update');

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1, 'Current password is required'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, 'New password must be at least 8 characters long')
      .refine(
        (val) => Buffer.byteLength(val, 'utf8') <= 72,
        'New password cannot exceed 72 bytes'
      ),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.confirmNewPassword || data.newPassword === data.confirmNewPassword,
    {
      message: 'New passwords do not match',
      path: ['confirmNewPassword'],
    }
  );
