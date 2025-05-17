import { Category } from '../../../../../../src/modules/categories/domain/entities/Category';

describe('Category Entity', () => {
  it('should create a valid category with all properties', () => {
    // Arrange
    const id = '123';
    const name = 'Test Category';
    const createdAt = new Date();
    const updatedAt = new Date();

    // Act
    const category = new Category(id, name, createdAt, updatedAt);

    // Assert
    expect(category.id).toBe(id);
    expect(category.name).toBe(name);
    expect(category.createdAt).toBe(createdAt);
    expect(category.updatedAt).toBe(updatedAt);
  });

  it('should update name correctly', () => {
    // Arrange
    const category = new Category(
      '123',
      'Initial Name',
      new Date(),
      new Date()
    );
    const newName = 'Updated Name';

    // Act
    category.updateName(newName);

    // Assert
    expect(category.name).toBe(newName);
  });
}); 