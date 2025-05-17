import { ICategoryRepository } from "../../../domain/interfaces/repositories/ICategoryRepository";
import { DeleteCategoryResponseDto } from "./DeleteCategoryResponseDto";

/**
 * Data transfer object for deleting a category request
 */
export interface DeleteCategoryRequestDto {
  id: string;
}

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executes the delete category use case
   * @param id The ID of the category to delete
   * @returns Response DTO with success status and category name
   * @throws Error if category is not found
   */
  async execute(id: string): Promise<DeleteCategoryResponseDto> {
    // Check if category exists
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error(`Category with ID ${id} not found`);
    }

    // Store the category name before deletion
    const categoryName = existingCategory.name;

    // Delete the category
    const isDeleted = await this.categoryRepository.delete(id);
    if (!isDeleted) {
      throw new Error(`Failed to delete category with ID ${id}`);
    }

    return { 
      success: true,
      categoryName: categoryName
    };
  }
} 