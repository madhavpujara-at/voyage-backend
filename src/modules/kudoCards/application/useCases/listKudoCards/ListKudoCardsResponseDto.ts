/**
 * Data transfer object for individual kudoCard in list response
 */
export interface KudoCardsDto {
  id: string;
  message: string;
  recipientName: string;
  giverId: string;
  giverEmail?: string;
  giverName?: string;
  teamId: string;
  teamName?: string;
  categoryId: string;
  categoryName?: string;
  createdAt: Date;
}

/**
 * Data transfer object for list kudoCards response
 */
export interface ListKudoCardsResponseDto {
  kudoCards: KudoCardsDto[];
  total: number;
}
