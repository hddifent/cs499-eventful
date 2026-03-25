import z from 'zod';

export const zUsernameLikeField = (fieldName: string = 'Username') =>
	z
		.string()
		.min(1, { message: `${fieldName} cannot be empty.` })
		.max(32, { message: `${fieldName} must not exceed 32 characters.` })
		.regex(/^[a-zA-Z]/, { message: `${fieldName} must start with a letter.` })
		.regex(/^(?!.*[_.]{2})/, {
			message: `${fieldName} cannot have consecutive underscores or periods.`
		})
		.regex(/^[a-zA-Z0-9_.]+$/, {
			message: `${fieldName} can only contain letters, numbers, underscores, or periods.`
		});

export const zDisplayNameLikeField = (fieldName: string = 'Display name') =>
	z
		.string()
		.trim()
		.min(1, { message: `${fieldName} cannot be empty.` })
		.max(100, { message: `${fieldName} must not exceed 100 characters.` })
		.regex(/^[a-zA-Z0-9_. -]+$/, { message: `${fieldName} contains invalid characters.` });

export const zPasswordLikeField = (fieldName: string = 'Password') =>
	z
		.string()
		.min(8, { message: `${fieldName} must be at least 8 characters.` })
		.max(64, { message: `${fieldName} must not exceed 64 characters.` });
