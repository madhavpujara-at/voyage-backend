import { PrismaClient } from "../../../../infrastructure/database/generated/prisma";
import { Category } from "../../domain/entities/Category";
import { ICategoryRepository } from "../../domain/interfaces/repositories/ICategoryRepository";

export class CategoryPrismaRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Maps a Prisma Category model to our domain Category entity
   */
  private mapToDomain(prismaCategory: any): Category {
    return new Category(prismaCategory.id, prismaCategory.name, prismaCategory.createdAt, prismaCategory.updatedAt);
  }

  /**
   * Creates a new category
   * @param categoryData The category data to create
   * @returns The created category
   */
  async create(categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    const category = await this.prisma.category.create({
      data: {
        name: categoryData.name,
      },
    });

    return this.mapToDomain(category);
  }

  /**
   * Finds all categories
   * @returns Array of all categories
   */
  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return categories.map(this.mapToDomain);
  }

  /**
   * Finds a category by its ID
   * @param id The ID of the category to find
   * @returns The found category or null if not found
   */
  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return null;
    }

    return this.mapToDomain(category);
  }

  /**
   * Updates a category
   * @param id The ID of the category to update
   * @param data The data to update
   * @returns The updated category or null if not found
   */
  async update(id: string, data: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>): Promise<Category | null> {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data,
      });

      return this.mapToDomain(category);
    } catch (error) {
      // Prisma throws an error if the record is not found during update
      return null;
    }
  }

  /**
   * Deletes a category
   * @param id The ID of the category to delete
   * @returns true if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // Prisma throws an error if the record is not found during delete
      return false;
    }
  }

  /**
   * Finds a category by its name
   * @param name The name of the category to find
   * @returns The found category or null if not found
   */
  async findByName(name: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: { name },
    });

    if (!category) {
      return null;
    }

    return this.mapToDomain(category);
  }
}
