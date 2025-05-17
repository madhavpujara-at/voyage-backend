/**
 * Category entity representing a classification for kudos
 */
export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Updates the name of the category
   * @param name The new name for the category
   */
  updateName(name: string): void {
    this.name = name;
  }
}
