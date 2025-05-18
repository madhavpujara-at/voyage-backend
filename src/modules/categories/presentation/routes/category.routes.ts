import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { validateRequest } from "../validation/validateRequest";
import { createCategorySchema } from "../validation/createCategorySchema";
import { updateCategorySchema } from "../validation/updateCategorySchema";
import { idParamSchema } from "../validation/idParamSchema";
import { authenticateJwt, authorizeRoles } from "../../../auth/presentation/middleware/jwtStrategy";

export const createCategoryRouter = (categoryController: CategoryController) => {
  const router = Router();

  /**
   * @openapi
   * tags:
   *   name: Categories
   *   description: API endpoints for category management
   */

  /**
   * @openapi
   * /categories:
   *   post:
   *     tags: [Categories]
   *     summary: Create a new category
   *     description: Creates a new category with the provided details. Only accessible to Tech Lead and Admin roles.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCategoryInput'
   *     responses:
   *       '200':
   *         description: Category created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CategoryResponse'
   *       '400':
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationErrorResponse'
   */
  router.post(
    "/",
    authenticateJwt,
    authorizeRoles(["TechLead", "ADMIN"]),
    validateRequest(createCategorySchema),
    categoryController.createCategory.bind(categoryController),
  );

  /**
   * @openapi
   * /categories:
   *   get:
   *     tags: [Categories]
   *     summary: List all categories
   *     description: Retrieves a list of all available categories. Accessible to all authenticated users.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: List of categories retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/CategoryResponse'
   *       '400':
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationErrorResponse'
   */
  router.get("/", authenticateJwt, categoryController.listCategories.bind(categoryController));

  /**
   * @openapi
   * /categories/{id}:
   *   put:
   *     tags: [Categories]
   *     summary: Update a category
   *     description: Updates an existing category with the provided details. Only accessible to Admin role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Unique identifier of the category to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCategoryInput'
   *     responses:
   *       '200':
   *         description: Category updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CategoryResponse'
   *       '400':
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationErrorResponse'
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
   * @openapi
   * /categories/{id}:
   *   delete:
   *     tags: [Categories]
   *     summary: Delete a category
   *     description: Deletes an existing category. Only accessible to Admin role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Unique identifier of the category to delete
   *     responses:
   *       '200':
   *         description: Category deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Category deleted successfully
   *       '400':
   *         description: Invalid request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationErrorResponse'
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
