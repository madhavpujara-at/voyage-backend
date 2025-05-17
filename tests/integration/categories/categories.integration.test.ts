import request from "supertest";
import express from "express";
import { CategoryController } from "../../../src/modules/categories/presentation/controllers/category.controller";
import { CreateCategoryUseCase } from "../../../src/modules/categories/application/useCases/createCategory/CreateCategoryUseCase";
import { ListCategoriesUseCase } from "../../../src/modules/categories/application/useCases/listCategories/ListCategoriesUseCase";
import { UpdateCategoryUseCase } from "../../../src/modules/categories/application/useCases/updateCategory/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "../../../src/modules/categories/application/useCases/deleteCategory/DeleteCategoryUseCase";
import { Category } from "../../../src/modules/categories/domain/entities/Category";
import { mock } from "jest-mock-extended";
import { ICategoryRepository } from "../../../src/modules/categories/domain/interfaces/repositories/ICategoryRepository";
import { ListCategoriesResponseDto } from "../../../src/modules/categories/application/useCases/listCategories/ListCategoriesResponseDto";
import { DeleteCategoryResponseDto } from "../../../src/modules/categories/application/useCases/deleteCategory/DeleteCategoryResponseDto";

// Create a helper function to create category data
const createCategoryData = (name: string): Pick<Category, "name" | "updateName"> => {
  return {
    name,
    updateName: jest.fn(),
  };
};

describe("Categories API Integration Tests", () => {
  let app: express.Application;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    // Create express app
    app = express();
    app.use(express.json());

    // Setup mock repository
    mockCategoryRepository = mock<ICategoryRepository>();

    // Setup use cases with mock repositories
    const createCategoryUseCase = new CreateCategoryUseCase(mockCategoryRepository);
    const listCategoriesUseCase = new ListCategoriesUseCase(mockCategoryRepository);
    const updateCategoryUseCase = new UpdateCategoryUseCase(mockCategoryRepository);
    const deleteCategoryUseCase = new DeleteCategoryUseCase(mockCategoryRepository);

    // Setup controller
    const categoryController = new CategoryController(
      createCategoryUseCase,
      listCategoriesUseCase,
      updateCategoryUseCase,
      deleteCategoryUseCase,
    );

    // Setup routes
    app.post("/api/categories", (req, res, next) => categoryController.createCategory(req, res, next));
    app.get("/api/categories", (req, res, next) => categoryController.listCategories(req, res, next));
    app.put("/api/categories/:id", (req, res, next) => categoryController.updateCategory(req, res, next));
    app.delete("/api/categories/:id", (req, res, next) => categoryController.deleteCategory(req, res, next));

    // Setup error handler
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(500).json({ message: err.message });
    });
  });

  describe("POST /api/categories", () => {
    it("should create a new category successfully", async () => {
      // Arrange
      const categoryName = "Test Category";
      const createdCategory = new Category("123", categoryName, new Date(), new Date());

      mockCategoryRepository.findByName.mockResolvedValue(null);
      mockCategoryRepository.create.mockResolvedValue(createdCategory);

      // Act
      const response = await request(app)
        .post("/api/categories")
        .send({ name: categoryName })
        .set("Accept", "application/json");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: createdCategory.id,
        name: createdCategory.name,
        createdAt: createdCategory.createdAt.toISOString(),
        updatedAt: createdCategory.updatedAt.toISOString(),
      });
      expect(mockCategoryRepository.findByName).toHaveBeenCalledWith(categoryName);
      expect(mockCategoryRepository.create).toHaveBeenCalled();
    });

    it("should handle category already exists error", async () => {
      // Arrange
      const existingCategoryName = "Existing Category";
      const existingCategory = new Category("123", existingCategoryName, new Date(), new Date());

      mockCategoryRepository.findByName.mockResolvedValue(existingCategory);

      // Act
      const response = await request(app)
        .post("/api/categories")
        .send({ name: existingCategoryName })
        .set("Accept", "application/json");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: `Category with name '${existingCategoryName}' already exists`,
        exists: true,
      });
      expect(mockCategoryRepository.findByName).toHaveBeenCalledWith(existingCategoryName);
      expect(mockCategoryRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/categories", () => {
    it("should list all categories", async () => {
      // Arrange
      const categories = [
        new Category("1", "Category 1", new Date(), new Date()),
        new Category("2", "Category 2", new Date(), new Date()),
      ];

      mockCategoryRepository.findAll.mockResolvedValue(categories);

      const responseDto: ListCategoriesResponseDto = {
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
        })),
      };

      // Act
      const response = await request(app).get("/api/categories").set("Accept", "application/json");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(responseDto);
      expect(mockCategoryRepository.findAll).toHaveBeenCalled();
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("should update a category successfully", async () => {
      // Arrange
      const categoryId = "123";
      const newName = "Updated Category";
      const updatedCategory = new Category(categoryId, newName, new Date(), new Date());

      mockCategoryRepository.findById.mockResolvedValue(updatedCategory);
      mockCategoryRepository.findByName.mockResolvedValue(null);
      mockCategoryRepository.update.mockResolvedValue(updatedCategory);

      // Act
      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send({ name: newName })
        .set("Accept", "application/json");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: updatedCategory.id,
        name: updatedCategory.name,
        createdAt: updatedCategory.createdAt.toISOString(),
        updatedAt: updatedCategory.updatedAt.toISOString(),
      });
      expect(mockCategoryRepository.update).toHaveBeenCalled();
    });

    it("should return 404 when updating non-existent category", async () => {
      // Arrange
      const categoryId = "999";
      const newName = "Updated Category";

      mockCategoryRepository.update.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send({ name: newName })
        .set("Accept", "application/json");

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", `Category with ID ${categoryId} not found`);
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("should delete a category successfully", async () => {
      // Arrange
      const categoryId = "123";
      const categoryName = "Test Category";
      const category = new Category(categoryId, categoryName, new Date(), new Date());

      mockCategoryRepository.findById.mockResolvedValue(category);
      mockCategoryRepository.delete.mockResolvedValue(true);

      const responseDto: DeleteCategoryResponseDto = {
        success: true,
        categoryName: categoryName,
      };

      // Act
      const response = await request(app).delete(`/api/categories/${categoryId}`).set("Accept", "application/json");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: `Category with ID ${categoryId} has been successfully deleted`,
        categoryName: categoryName,
      });
      expect(mockCategoryRepository.delete).toHaveBeenCalledWith(categoryId);
    });

    it("should return 404 when deleting non-existent category", async () => {
      // Arrange
      const categoryId = "999";

      mockCategoryRepository.findById.mockResolvedValue(null);

      // Act
      const response = await request(app).delete(`/api/categories/${categoryId}`).set("Accept", "application/json");

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", `Category with ID ${categoryId} not found`);
    });
  });
});
