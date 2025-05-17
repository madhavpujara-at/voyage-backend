import { Category } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../domain/interfaces/repositories/ICategoryRepository";
import { UpdateCategoryRequestDto } from "./UpdateCategoryRequestDto";
import { UpdateCategoryResponseDto } from "./UpdateCategoryResponseDto";

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executes the update category use case
   * @param id The ID of the category to update
   * @param data The category data to update
   * @returns The updated category as a DTO
   * @throws Error if category is not found or validation fails
   */
  async execute(id: string, data: UpdateCategoryRequestDto): Promise<UpdateCategoryResponseDto> {
    // Validate input data
    if (!data.name || data.name.trim() === "") {
      throw new Error("Category name is required");
    }

    const trimmedName = data.name.trim();

    // Check if category exists
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error(`Category with ID ${id} not found`);
    }

    // Check if the new name is already taken by another category
    if (trimmedName !== existingCategory.name) {
      const categoryWithSameName = await this.categoryRepository.findByName(trimmedName);
      if (categoryWithSameName && categoryWithSameName.id !== id) {
        throw new Error(`Category with name '${trimmedName}' already exists`);
      }
    }

    // Update the category
    const updatedCategory = await this.categoryRepository.update(id, {
      name: trimmedName,
    });

    if (!updatedCategory) {
      throw new Error(`Failed to update category with ID ${id}`);
    }

    // Map domain entity to response DTO
    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      createdAt: updatedCategory.createdAt.toISOString(),
      updatedAt: updatedCategory.updatedAt.toISOString(),
    };
  }
}
