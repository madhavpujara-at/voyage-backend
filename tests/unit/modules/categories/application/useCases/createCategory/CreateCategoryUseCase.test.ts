import { mock } from "jest-mock-extended";
import { ICategoryRepository } from "../../../../../../../src/modules/categories/domain/interfaces/repositories/ICategoryRepository";
import { CreateCategoryUseCase } from "../../../../../../../src/modules/categories/application/useCases/createCategory/CreateCategoryUseCase";
import { Category } from "../../../../../../../src/modules/categories/domain/entities/Category";

describe("CreateCategoryUseCase", () => {
  let createCategoryUseCase: CreateCategoryUseCase;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    // Setup mocks
    mockCategoryRepository = mock<ICategoryRepository>();
    createCategoryUseCase = new CreateCategoryUseCase(mockCategoryRepository);
  });

  it("should create a category successfully", async () => {
    // Arrange
    const categoryName = "Test Category";
    const categoryData = { name: categoryName };

    const mockCreatedCategory = new Category("123", categoryName, new Date(), new Date());

    mockCategoryRepository.findByName.mockResolvedValue(null);
    mockCategoryRepository.create.mockResolvedValue(mockCreatedCategory);

    // Act
    const result = await createCategoryUseCase.execute({ name: categoryName });

    // Assert
    expect(mockCategoryRepository.findByName).toHaveBeenCalledWith(categoryName);
    expect(mockCategoryRepository.create).toHaveBeenCalledWith({ name: categoryName });
    expect(result).toEqual({
      id: mockCreatedCategory.id,
      name: mockCreatedCategory.name,
      createdAt: mockCreatedCategory.createdAt.toISOString(),
      updatedAt: mockCreatedCategory.updatedAt.toISOString(),
    });
  });

  it("should throw an error if category name is empty", async () => {
    // Arrange
    const emptyName = "";

    // Act & Assert
    await expect(createCategoryUseCase.execute({ name: emptyName })).rejects.toThrow("Category name is required");

    expect(mockCategoryRepository.findByName).not.toHaveBeenCalled();
    expect(mockCategoryRepository.create).not.toHaveBeenCalled();
  });

  it("should throw an error if category already exists", async () => {
    // Arrange
    const existingCategoryName = "Existing Category";
    const existingCategory = new Category("123", existingCategoryName, new Date(), new Date());

    mockCategoryRepository.findByName.mockResolvedValue(existingCategory);

    // Act & Assert
    await expect(createCategoryUseCase.execute({ name: existingCategoryName })).rejects.toThrow(
      `Category with name '${existingCategoryName}' already exists`,
    );

    expect(mockCategoryRepository.findByName).toHaveBeenCalledWith(existingCategoryName);
    expect(mockCategoryRepository.create).not.toHaveBeenCalled();
  });

  it("should trim the category name before processing", async () => {
    // Arrange
    const untrimmedName = "  Test Category  ";
    const trimmedName = "Test Category";

    const mockCreatedCategory = new Category("123", trimmedName, new Date(), new Date());

    mockCategoryRepository.findByName.mockResolvedValue(null);
    mockCategoryRepository.create.mockResolvedValue(mockCreatedCategory);

    // Act
    await createCategoryUseCase.execute({ name: untrimmedName });

    // Assert
    expect(mockCategoryRepository.findByName).toHaveBeenCalledWith(trimmedName);
    expect(mockCategoryRepository.create).toHaveBeenCalledWith({ name: trimmedName });
  });
});
