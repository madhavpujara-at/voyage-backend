import { ICategoryRepository } from "../../../domain/interfaces/repositories/ICategoryRepository";
import { CreateCategoryRequestDto } from "./CreateCategoryRequestDto";
import { CreateCategoryResponseDto } from "./CreateCategoryResponseDto";

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executes the create category use case
   * @param data The category data to create
   * @returns The created category as a DTO
   */
  async execute(data: CreateCategoryRequestDto): Promise<CreateCategoryResponseDto> {
    // Validate input data
    if (!data.name || data.name.trim() === "") {
      throw new Error("Category name is required");
    }

    const trimmedName = data.name.trim();

    // Check if a category with the same name already exists
    const existingCategory = await this.categoryRepository.findByName(trimmedName);
    if (existingCategory) {
      throw new Error(`Category with name '${trimmedName}' already exists`);
    }

    // Create the category
    const category = await this.categoryRepository.create({
      name: trimmedName,
    });

    // Map domain entity to response DTO
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }
}
