/**
 * Data transfer object for listing kudoCards request
 */
export interface ListKudoCardsRequestDto {
  recipientName?: string;
  teamId?: string;
  categoryId?: string;
  searchTerm?: string;
  sortBy?: "recent" | "oldest";
}
