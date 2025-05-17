import { KudoCard } from "../../entities/KudoCards";

export interface FindAllKudoCardsOptions {
  recipientName?: string;
  teamId?: string;
  categoryId?: string;
  searchTerm?: string;
  sortBy?: "recent" | "oldest";
}

export interface CreateKudoCardData {
  message: string;
  recipientName: string;
  giverId: string;
  teamId: string;
  categoryId: string;
}

export interface IKudoCardRepository {
  save(kudoCardData: CreateKudoCardData): Promise<KudoCard>;
  findAll(options?: FindAllKudoCardsOptions): Promise<KudoCard[]>;
  findById(id: string): Promise<KudoCard | null>;
}
