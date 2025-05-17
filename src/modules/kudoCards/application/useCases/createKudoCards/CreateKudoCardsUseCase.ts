import { CreateKudoCardData, IKudoCardRepository } from "../../../domain/interfaces/repositories/IKudoCardsRepository";
import { CreateKudoCardsRequestDto } from "./CreateKudoCardsRequestDto";
import { CreateKudoCardsResponseDto } from "./CreateKudoCardsResponseDto";

export class CreateKudoCardsUseCase {
  constructor(private readonly kudoCardRepository: IKudoCardRepository) {}

  async execute(data: CreateKudoCardsRequestDto, giverId: string): Promise<CreateKudoCardsResponseDto> {
    // Create the data object for saving
    const kudoCardData: CreateKudoCardData = {
      message: data.message,
      recipientName: data.recipientName,
      teamId: data.teamId,
      categoryId: data.categoryId,
      giverId,
    };
    
    // Save the kudo card in the repository
    const kudoCard = await this.kudoCardRepository.save(kudoCardData);

    // Return simplified response with only id and success flag
    return {
      id: kudoCard.getId(),
      success: true,
    };
  }
}
