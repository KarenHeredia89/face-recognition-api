import { z } from "zod";

export const clarifaiApiSchema = z.object({
  input: z.url({ message: "Input must be a valid URL" }),
});

export const incrementEntriesSchema = z.object({
  id: z.coerce.number().int().positive({ message: "Invalid user ID" }),
});

export type ClarifaiApi = z.infer<typeof clarifaiApiSchema>;
export type IncrementEntries = z.infer<typeof incrementEntriesSchema>;
