import { z } from 'zod';

// Schema for creating a team
export const createTeamSchema = z.object({
  name: z.string()
    .min(1, 'Team name is required')
    .max(100, 'Team name cannot exceed 100 characters')
    .trim()
});

// Schema for updating a team
export const updateTeamSchema = z.object({
  name: z.string()
    .min(1, 'Team name is required')
    .max(100, 'Team name cannot exceed 100 characters')
    .trim()
});

// Schema for team ID parameter
export const teamIdSchema = z.object({
  teamId: z.string()
    .uuid('Invalid team ID format')
});

// Combined schema for update operation (params + body)
export const updateTeamWithParamsSchema = teamIdSchema.merge(updateTeamSchema);

// Combined schema for delete operation (params only)
export const deleteTeamSchema = teamIdSchema; 