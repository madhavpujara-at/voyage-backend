import { Category } from "../../entities/Category";

/**
 * Interface for the Category repository operations
 */
export interface ICategoryRepository {
  /**
   * Creates a new category
   * @param data Simple object with name property
   * @returns The created category
   */
  create(data: { name: string }): Promise<Category>;

  /**
   * Finds all categories
   * @returns Array of all categories
   */
  findAll(): Promise<Category[]>;

  /**
   * Finds a category by its ID
   * @param id The ID of the category to find
   * @returns The found category or null if not found
   */
  findById(id: string): Promise<Category | null>;

  /**
   * Finds a category by its name
   * @param name The name of the category to find
   * @returns The found category or null if not found
   */
  findByName(name: string): Promise<Category | null>;

  /**
   * Updates a category
   * @param id The ID of the category to update
   * @param data The data to update
   * @returns The updated category or null if not found
   */
  update(id: string, data: { name: string }): Promise<Category | null>;

  /**
   * Deletes a category
   * @param id The ID of the category to delete
   * @returns true if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;
}
