import { PrismaClient } from "../../infrastructure/database/generated/prisma";
import { CategoryPrismaRepository } from "./infrastructure/repositories/CategoryPrismaRepository";
import { CreateCategoryUseCase } from "./application/useCases/createCategory/CreateCategoryUseCase";
import { ListCategoriesUseCase } from "./application/useCases/listCategories/ListCategoriesUseCase";
import { UpdateCategoryUseCase } from "./application/useCases/updateCategory/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "./application/useCases/deleteCategory/DeleteCategoryUseCase";
import { CategoryController } from "./presentation/controllers/category.controller";
import { createCategoryRouter } from "./presentation/routes/category.routes";

// Factory function to create and wire up all dependencies
export const createCategoriesModule = (prisma: PrismaClient) => {
  // Create repository (infrastructure layer)
  const categoryRepository = new CategoryPrismaRepository(prisma);

  // Create use cases (application layer)
  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

  // Create controller (presentation layer)
  const categoryController = new CategoryController(
    createCategoryUseCase,
    listCategoriesUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase,
  );

  // Create router
  const categoryRouter = createCategoryRouter(categoryController);

  return {
    router: categoryRouter,
    repository: categoryRepository,
    controller: categoryController,
    useCases: {
      createCategoryUseCase,
      listCategoriesUseCase,
      updateCategoryUseCase,
      deleteCategoryUseCase,
    },
  };
};
