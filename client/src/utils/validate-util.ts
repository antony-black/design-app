import { zValidationScheme } from '@design-app/backend/src/schemas/z-validation-schema';
import { withZodSchema } from 'formik-validator-zod';
import type { TIdea } from '@/types/input-types';

export const validate = withZodSchema<TIdea>(zValidationScheme);
