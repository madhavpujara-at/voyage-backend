import { ICategoryRepository } from "../../../domain/interfaces/repositories/ICategoryRepository";
import { ListCategoriesResponseDto } from "./ListCategoriesResponseDto";

export class ListCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executes the list categories use case
   * @returns All categories in a DTO format
   */
  async execute(): Promise<ListCategoriesResponseDto> {
    const categories = await this.categoryRepository.findAll();

    // Map domain entities to response DTO
    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      })),
    };
  }
}
