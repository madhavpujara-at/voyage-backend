import { z } from "zod";
import { CreateKudoCardsRequestDto } from "../../application/useCases/createKudoCards/CreateKudoCardsRequestDto";

export const createKudoCardsSchema = z.object({
  recipientName: z.string().min(1, { message: "Recipient name is required" }).max(100),
  teamId: z.string().uuid({ message: "Valid team ID is required" }),
  categoryId: z.string().uuid({ message: "Valid category ID is required" }),
  message: z.string().min(1, { message: "Message is required" }).max(500),
}) satisfies z.ZodType<CreateKudoCardsRequestDto>;
