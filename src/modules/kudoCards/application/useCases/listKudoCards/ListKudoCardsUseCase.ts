import {
  FindAllKudoCardsOptions,
  IKudoCardRepository,
} from "../../../domain/interfaces/repositories/IKudoCardsRepository";
import { ListKudoCardsRequestDto } from "./ListKudoCardsRequestDto";
import { ListKudoCardsResponseDto } from "./ListKudoCardsResponseDto";

export class ListKudoCardsUseCase {
  constructor(private readonly kudoCardRepository: IKudoCardRepository) {}

  async execute(requestDto: ListKudoCardsRequestDto): Promise<ListKudoCardsResponseDto> {
    // Map request DTO to repository options
    const options: FindAllKudoCardsOptions = {
      recipientName: requestDto.recipientName,
      teamId: requestDto.teamId,
      categoryId: requestDto.categoryId,
      searchTerm: requestDto.searchTerm,
      sortBy: requestDto.sortBy || "recent", // Default to recent if not specified
    };

    // Get kudoCards from repository
    const kudoCards = await this.kudoCardRepository.findAll(options);

    // Return the response
    return {
      kudoCards: kudoCards.map((card) => ({
        id: card.getId(),
        message: card.getMessage(),
        recipientName: card.getRecipientName(),
        giverId: card.getGiverId(),
        giverEmail: card.getGiverEmail(),
        giverName: card.getGiverName(),
        teamId: card.getTeamId(),
        teamName: card.getTeamName(),
        categoryId: card.getCategoryId(),
        categoryName: card.getCategoryName(),
        createdAt: card.getCreatedAt(),
      })),
      total: kudoCards.length,
    };
  }
}
