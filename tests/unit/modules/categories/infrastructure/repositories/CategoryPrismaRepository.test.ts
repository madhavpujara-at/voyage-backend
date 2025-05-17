import { PrismaClient } from '../../../../../../src/infrastructure/database/generated/prisma';
import { CategoryPrismaRepository } from '../../../../../../src/modules/categories/infrastructure/repositories/CategoryPrismaRepository';
import { Category } from '../../../../../../src/modules/categories/domain/entities/Category';

// Create a helper function to create category data
const createCategoryData = (name: string): Pick<Category, 'name' | 'updateName'> => {
  return {
    name,
    updateName: jest.fn()
  };
};

describe('CategoryPrismaRepository', () => {
  let categoryRepository: CategoryPrismaRepository;
  let mockPrisma: any;
  
  beforeEach(() => {
    // Mock PrismaClient and its category model
    mockPrisma = {
      category: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      }
    };
    
    categoryRepository = new CategoryPrismaRepository(mockPrisma as unknown as PrismaClient);
  });
  
  describe('create', () => {
    it('should create a category successfully', async () => {
      // Arrange
      const categoryName = 'Test Category';
      const categoryData = createCategoryData(categoryName);
      
      const createdDate = new Date();
      const mockPrismaCategory = {
        id: '123',
        name: categoryName,
        createdAt: createdDate,
        updatedAt: createdDate,
      };
      
      mockPrisma.category.create.mockResolvedValue(mockPrismaCategory);
      
      // Act
      const result = await categoryRepository.create(categoryData);
      
      // Assert
      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: { name: categoryName },
      });
      expect(result).toBeInstanceOf(Category);
      expect(result.id).toBe(mockPrismaCategory.id);
      expect(result.name).toBe(mockPrismaCategory.name);
      expect(result.createdAt).toBe(mockPrismaCategory.createdAt);
      expect(result.updatedAt).toBe(mockPrismaCategory.updatedAt);
    });
  });
  
  describe('findAll', () => {
    it('should return all categories', async () => {
      // Arrange
      const mockPrismaCategories = [
        {
          id: '1',
          name: 'Category 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Category 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      mockPrisma.category.findMany.mockResolvedValue(mockPrismaCategories);
      
      // Act
      const result = await categoryRepository.findAll();
      
      // Assert
      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Category);
      expect(result[0].id).toBe(mockPrismaCategories[0].id);
      expect(result[1]).toBeInstanceOf(Category);
      expect(result[1].id).toBe(mockPrismaCategories[1].id);
    });
  });
  
  describe('findById', () => {
    it('should return a category by ID if it exists', async () => {
      // Arrange
      const categoryId = '123';
      const mockPrismaCategory = {
        id: categoryId,
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockPrisma.category.findUnique.mockResolvedValue(mockPrismaCategory);
      
      // Act
      const result = await categoryRepository.findById(categoryId);
      
      // Assert
      expect(mockPrisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(result).toBeInstanceOf(Category);
      expect(result?.id).toBe(categoryId);
    });
    
    it('should return null if category does not exist', async () => {
      // Arrange
      const categoryId = '999';
      mockPrisma.category.findUnique.mockResolvedValue(null);
      
      // Act
      const result = await categoryRepository.findById(categoryId);
      
      // Assert
      expect(mockPrisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(result).toBeNull();
    });
  });
  
  describe('findByName', () => {
    it('should return a category by name if it exists', async () => {
      // Arrange
      const categoryName = 'Test Category';
      const mockPrismaCategory = {
        id: '123',
        name: categoryName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockPrisma.category.findFirst.mockResolvedValue(mockPrismaCategory);
      
      // Act
      const result = await categoryRepository.findByName(categoryName);
      
      // Assert
      expect(mockPrisma.category.findFirst).toHaveBeenCalledWith({
        where: { name: categoryName },
      });
      expect(result).toBeInstanceOf(Category);
      expect(result?.name).toBe(categoryName);
    });
    
    it('should return null if category does not exist', async () => {
      // Arrange
      const categoryName = 'Non-existent Category';
      mockPrisma.category.findFirst.mockResolvedValue(null);
      
      // Act
      const result = await categoryRepository.findByName(categoryName);
      
      // Assert
      expect(mockPrisma.category.findFirst).toHaveBeenCalledWith({
        where: { name: categoryName },
      });
      expect(result).toBeNull();
    });
  });
  
  describe('update', () => {
    it('should update a category successfully', async () => {
      // Arrange
      const categoryId = '123';
      const newName = 'Updated Category';
      const updateData = { name: newName };
      const mockPrismaCategory = {
        id: categoryId,
        name: newName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockPrisma.category.update.mockResolvedValue(mockPrismaCategory);
      
      // Act
      const result = await categoryRepository.update(categoryId, updateData);
      
      // Assert
      expect(mockPrisma.category.update).toHaveBeenCalledWith({
        where: { id: categoryId },
        data: updateData,
      });
      expect(result).toBeInstanceOf(Category);
      expect(result?.name).toBe(newName);
    });
    
    it('should return null if category does not exist', async () => {
      // Arrange
      const categoryId = '999';
      const newName = 'Updated Category';
      const updateData = { name: newName };
      
      mockPrisma.category.update.mockRejectedValue(new Error('Record not found'));
      
      // Act
      const result = await categoryRepository.update(categoryId, updateData);
      
      // Assert
      expect(mockPrisma.category.update).toHaveBeenCalledWith({
        where: { id: categoryId },
        data: updateData,
      });
      expect(result).toBeNull();
    });
  });
  
  describe('delete', () => {
    it('should delete a category successfully', async () => {
      // Arrange
      const categoryId = '123';
      mockPrisma.category.delete.mockResolvedValue({});
      
      // Act
      const result = await categoryRepository.delete(categoryId);
      
      // Assert
      expect(mockPrisma.category.delete).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(result).toBe(true);
    });
    
    it('should return false if category does not exist', async () => {
      // Arrange
      const categoryId = '999';
      mockPrisma.category.delete.mockRejectedValue(new Error('Record not found'));
      
      // Act
      const result = await categoryRepository.delete(categoryId);
      
      // Assert
      expect(mockPrisma.category.delete).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(result).toBe(false);
    });
  });
}); 