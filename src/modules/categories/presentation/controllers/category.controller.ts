import { Request, Response, NextFunction } from "express";
import { CreateCategoryUseCase } from "../../application/useCases/createCategory/CreateCategoryUseCase";
import { ListCategoriesUseCase } from "../../application/useCases/listCategories/ListCategoriesUseCase";
import { UpdateCategoryUseCase } from "../../application/useCases/updateCategory/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "../../application/useCases/deleteCategory/DeleteCategoryUseCase";
import { CreateCategoryRequestDto } from "../../application/useCases/createCategory/CreateCategoryRequestDto";
import { UpdateCategoryRequestDto } from "../../application/useCases/updateCategory/UpdateCategoryRequestDto";

/**
 * Controller for category-related endpoints
 */
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  /**
   * Creates a new category
   * @route POST /categories
   * @access Tech Lead, Admin
   */
  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestDto: CreateCategoryRequestDto = req.body;
      const responseDto = await this.createCategoryUseCase.execute(requestDto);
      res.status(200).json(responseDto);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        // Return success with a message that the category already exists
        res.status(200).json({
          success: true,
          message: error.message,
          exists: true,
        });
        return;
      }
      next(error);
    }
  }

  /**
   * Lists all categories
   * @route GET /categories
   * @access All authenticated users
   */
  async listCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseDto = await this.listCategoriesUseCase.execute();
      res.status(200).json(responseDto);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a category
   * @route PUT /categories/:id
   * @access Admin
   */
  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const requestDto: UpdateCategoryRequestDto = req.body;
      const responseDto = await this.updateCategoryUseCase.execute(id, requestDto);
      res.status(200).json(responseDto);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        // Return success with a message that the category name already exists
        res.status(200).json({
          success: true,
          message: error.message,
          exists: true,
        });
        return;
      } else if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * Deletes a category
   * @route DELETE /categories/:id
   * @access Admin
   */
  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const responseDto = await this.deleteCategoryUseCase.execute(id);
      res.status(200).json({
        success: true,
        message: `Category with ID ${id} has been successfully deleted`,
        categoryName: responseDto.categoryName,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  }
}
