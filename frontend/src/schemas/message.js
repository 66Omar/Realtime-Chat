import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().min(1, "Message can't be empty").max(500, "Message can't exceed 500 characters")
});
