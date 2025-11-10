import { updateUserLanguageSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class ChangeLangDto extends createZodDto(updateUserLanguageSchema) {}
