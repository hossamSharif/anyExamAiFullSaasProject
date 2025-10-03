import { z } from 'zod';

/**
 * Validation schemas for authentication forms
 * Supports Arabic and English error messages
 */

export interface ValidationMessages {
  required: string;
  invalidEmail: string;
  passwordTooShort: string;
  passwordsDoNotMatch: string;
}

export const createAuthSchemas = (messages: ValidationMessages) => {
  const emailSchema = z
    .string()
    .min(1, messages.required)
    .email(messages.invalidEmail);

  const passwordSchema = z
    .string()
    .min(8, messages.passwordTooShort);

  const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, messages.required),
  });

  const signupSchema = z
    .object({
      fullName: z.string().min(1, messages.required),
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: z.string().min(1, messages.required),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordsDoNotMatch,
      path: ['confirmPassword'],
    });

  const forgotPasswordSchema = z.object({
    email: emailSchema,
  });

  return {
    loginSchema,
    signupSchema,
    forgotPasswordSchema,
  };
};

// Arabic error messages
export const arValidationMessages: ValidationMessages = {
  required: 'هذا الحقل مطلوب',
  invalidEmail: 'البريد الإلكتروني غير صالح',
  passwordTooShort: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
  passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
};

// English error messages
export const enValidationMessages: ValidationMessages = {
  required: 'This field is required',
  invalidEmail: 'Invalid email address',
  passwordTooShort: 'Password must be at least 8 characters',
  passwordsDoNotMatch: 'Passwords do not match',
};

// Default schemas with Arabic messages
export const {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
} = createAuthSchemas(arValidationMessages);

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
