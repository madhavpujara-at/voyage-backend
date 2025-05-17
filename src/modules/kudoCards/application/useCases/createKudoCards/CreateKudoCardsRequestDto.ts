/**
 * Data transfer object for creating a kudoCard request
 */
export interface CreateKudoCardsRequestDto {
  recipientName: string;
  teamId: string;
  categoryId: string;
  message: string;
}
