import { z } from "zod";
import { ListKudoCardsRequestDto } from "../../application/useCases/listKudoCards/ListKudoCardsRequestDto";

export const listKudoCardsSchema = z.object({
  recipientName: z.string().optional(),
  teamId: z.string().uuid({ message: "Invalid team ID format" }).optional(),
  categoryId: z.string().uuid({ message: "Invalid category ID format" }).optional(),
  searchTerm: z.string().optional(),
  sortBy: z.enum(["recent", "oldest"]).optional(),
}) satisfies z.ZodType<ListKudoCardsRequestDto>;
