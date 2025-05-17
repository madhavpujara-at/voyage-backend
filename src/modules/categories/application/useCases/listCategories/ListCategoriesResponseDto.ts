/**
 * Data transfer object for category item in list response
 */
export interface CategoryItemDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data transfer object for list categories response
 */
export interface ListCategoriesResponseDto {
  categories: CategoryItemDto[];
}
