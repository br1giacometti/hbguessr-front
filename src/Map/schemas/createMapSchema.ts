import { z } from "zod";

const createMapSchema = z.object({
  name: z.string().min(2, { message: "nameMustBeAtleast3" }),
  imageUrl: z.string().min(2, { message: "nameMustBeAtleast3" }),
});

export type CreateMapSchema = z.infer<typeof createMapSchema>;

export default createMapSchema;
