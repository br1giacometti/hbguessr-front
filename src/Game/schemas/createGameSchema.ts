import { z } from "zod";

const createGameSchema = z.object({});

export type CreateGameSchema = z.infer<typeof createGameSchema>;

export default createGameSchema;
