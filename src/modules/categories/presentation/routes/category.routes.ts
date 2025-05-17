import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { validateRequest } from "../validation/validateRequest";
import { createCategorySchema } from "../validation/createCategorySchema";
import { updateCategorySchema } from "../validation/updateCategorySchema";
import { idParamSchema } from "../validation/idParamSchema";

// Import authentication middleware
import { authenticateJwt, authorizeRoles } from "@/modules/auth/presentation/middleware/jwtStrategy";

export const createCategoryRouter = (categoryController: CategoryController) => {
  const router = Router();

  /**
   * @route POST /categories
   * @desc Create a new category
   * @access Tech Lead, Admin
   */
  router.post(
    "/",
    authenticateJwt,
    authorizeRoles(["TechLead", "ADMIN"]),
    validateRequest(createCategorySchema),
    categoryController.createCategory.bind(categoryController),
  );

  /**
   * @route GET /categories
   * @desc List all categories
   * @access All authenticated users
   */
  router.get("/", authenticateJwt, categoryController.listCategories.bind(categoryController));

  /**
   * @route PUT /categories/:id
   * @desc Update a category
   * @access Admin
   */
  router.put(
    "/:id",
    authenticateJwt,
    authorizeRoles(["ADMIN"]),
    validateRequest(idParamSchema, "params"),
    validateRequest(updateCategorySchema),
    categoryController.updateCategory.bind(categoryController),
  );

  /**
   * @route DELETE /categories/:id
   * @desc Delete a category
   * @access Admin
   */
  router.delete(
    "/:id",
    authenticateJwt,
    authorizeRoles(["ADMIN"]),
    validateRequest(idParamSchema, "params"),
    categoryController.deleteCategory.bind(categoryController),
  );

  return router;
};
