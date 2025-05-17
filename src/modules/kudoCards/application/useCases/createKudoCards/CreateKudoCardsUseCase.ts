import { IKudoCardRepository } from "../../../domain/interfaces/repositories/IKudoCardsRepository";
import { CreateKudoCardsRequestDto } from "./CreateKudoCardsRequestDto";
import { CreateKudoCardsResponseDto } from "./CreateKudoCardsResponseDto";
import { KudoCard } from "../../../domain/entities/KudoCards";
import crypto from "crypto";

export class CreateKudoCardsUseCase {
  constructor(private readonly kudoCardRepository: IKudoCardRepository) {}

  async execute(data: CreateKudoCardsRequestDto, giverId: string): Promise<CreateKudoCardsResponseDto> {
    // Generate a UUID for the entity
    const id = crypto.randomUUID();

    // Create the KudoCard entity with business validations
    const kudoCard = new KudoCard(
      id,
      data.message,
      data.recipientName,
      giverId,
      data.teamId,
      data.categoryId,
      new Date(), // createdAt
      new Date(), // updatedAt
    );

    // Save the kudo card entity in the repository
    const savedKudoCard = await this.kudoCardRepository.saveEntity(kudoCard);

    // Return simplified response with only id and success flag
    return {
      id: savedKudoCard.getId(),
      success: true,
    };
  }
}
