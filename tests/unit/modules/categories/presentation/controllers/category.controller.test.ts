import { Request, Response, NextFunction } from 'express';
import { CategoryController } from '../../../../../../src/modules/categories/presentation/controllers/category.controller';
import { CreateCategoryUseCase } from '../../../../../../src/modules/categories/application/useCases/createCategory/CreateCategoryUseCase';
import { ListCategoriesUseCase } from '../../../../../../src/modules/categories/application/useCases/listCategories/ListCategoriesUseCase';
import { UpdateCategoryUseCase } from '../../../../../../src/modules/categories/application/useCases/updateCategory/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '../../../../../../src/modules/categories/application/useCases/deleteCategory/DeleteCategoryUseCase';
import { ListCategoriesResponseDto } from '../../../../../../src/modules/categories/application/useCases/listCategories/ListCategoriesResponseDto';
import { DeleteCategoryResponseDto } from '../../../../../../src/modules/categories/application/useCases/deleteCategory/DeleteCategoryResponseDto';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let mockCreateCategoryUseCase: jest.Mocked<CreateCategoryUseCase>;
  let mockListCategoriesUseCase: jest.Mocked<ListCategoriesUseCase>;
  let mockUpdateCategoryUseCase: jest.Mocked<UpdateCategoryUseCase>;
  let mockDeleteCategoryUseCase: jest.Mocked<DeleteCategoryUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Mock use cases
    mockCreateCategoryUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateCategoryUseCase>;
    
    mockListCategoriesUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ListCategoriesUseCase>;
    
    mockUpdateCategoryUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateCategoryUseCase>;
    
    mockDeleteCategoryUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<DeleteCategoryUseCase>;

    // Create controller
    categoryController = new CategoryController(
      mockCreateCategoryUseCase,
      mockListCategoriesUseCase,
      mockUpdateCategoryUseCase,
      mockDeleteCategoryUseCase
    );

    // Mock request, response, and next
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      // Arrange
      const requestBody = { name: 'Test Category' };
      const responseDto = {
        id: '123',
        name: 'Test Category',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockRequest.body = requestBody;
      mockCreateCategoryUseCase.execute.mockResolvedValue(responseDto);

      // Act
      await categoryController.createCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockCreateCategoryUseCase.execute).toHaveBeenCalledWith(requestBody);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(responseDto);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle category already exists error', async () => {
      // Arrange
      const requestBody = { name: 'Existing Category' };
      const errorMessage = "Category with name 'Existing Category' already exists";
      
      mockRequest.body = requestBody;
      mockCreateCategoryUseCase.execute.mockRejectedValue(new Error(errorMessage));

      // Act
      await categoryController.createCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockCreateCategoryUseCase.execute).toHaveBeenCalledWith(requestBody);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: errorMessage,
        exists: true,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass other errors to next middleware', async () => {
      // Arrange
      const requestBody = { name: 'Test Category' };
      const error = new Error('Unexpected error');
      
      mockRequest.body = requestBody;
      mockCreateCategoryUseCase.execute.mockRejectedValue(error);

      // Act
      await categoryController.createCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockCreateCategoryUseCase.execute).toHaveBeenCalledWith(requestBody);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('listCategories', () => {
    it('should list all categories successfully', async () => {
      // Arrange
      const categoryItems = [
        {
          id: '123',
          name: 'Category 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '456',
          name: 'Category 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      const responseDto: ListCategoriesResponseDto = {
        categories: categoryItems
      };
      
      mockListCategoriesUseCase.execute.mockResolvedValue(responseDto);

      // Act
      await categoryController.listCategories(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockListCategoriesUseCase.execute).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(responseDto);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass errors to next middleware', async () => {
      // Arrange
      const error = new Error('Database error');
      mockListCategoriesUseCase.execute.mockRejectedValue(error);

      // Act
      await categoryController.listCategories(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockListCategoriesUseCase.execute).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
      // Arrange
      const categoryId = '123';
      const requestBody = { name: 'Updated Category' };
      const responseDto = {
        id: categoryId,
        name: 'Updated Category',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockRequest.params = { id: categoryId };
      mockRequest.body = requestBody;
      mockUpdateCategoryUseCase.execute.mockResolvedValue(responseDto);

      // Act
      await categoryController.updateCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockUpdateCategoryUseCase.execute).toHaveBeenCalledWith(categoryId, requestBody);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(responseDto);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle category name already exists error', async () => {
      // Arrange
      const categoryId = '123';
      const requestBody = { name: 'Existing Category' };
      const errorMessage = "Category with name 'Existing Category' already exists";
      
      mockRequest.params = { id: categoryId };
      mockRequest.body = requestBody;
      mockUpdateCategoryUseCase.execute.mockRejectedValue(new Error(errorMessage));

      // Act
      await categoryController.updateCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockUpdateCategoryUseCase.execute).toHaveBeenCalledWith(categoryId, requestBody);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: errorMessage,
        exists: true,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle category not found error', async () => {
      // Arrange
      const categoryId = '999';
      const requestBody = { name: 'Updated Category' };
      const errorMessage = `Category with ID ${categoryId} not found`;
      
      mockRequest.params = { id: categoryId };
      mockRequest.body = requestBody;
      mockUpdateCategoryUseCase.execute.mockRejectedValue(new Error(errorMessage));

      // Act
      await categoryController.updateCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockUpdateCategoryUseCase.execute).toHaveBeenCalledWith(categoryId, requestBody);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass other errors to next middleware', async () => {
      // Arrange
      const categoryId = '123';
      const requestBody = { name: 'Updated Category' };
      const error = new Error('Unexpected error');
      
      mockRequest.params = { id: categoryId };
      mockRequest.body = requestBody;
      mockUpdateCategoryUseCase.execute.mockRejectedValue(error);

      // Act
      await categoryController.updateCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockUpdateCategoryUseCase.execute).toHaveBeenCalledWith(categoryId, requestBody);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category successfully', async () => {
      // Arrange
      const categoryId = '123';
      const responseDto: DeleteCategoryResponseDto = { 
        success: true,
        categoryName: 'Test Category' 
      };
      
      mockRequest.params = { id: categoryId };
      mockDeleteCategoryUseCase.execute.mockResolvedValue(responseDto);

      // Act
      await categoryController.deleteCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockDeleteCategoryUseCase.execute).toHaveBeenCalledWith(categoryId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: `Category with ID ${categoryId} has been successfully deleted`,
        categoryName: responseDto.categoryName,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle category not found error', async () => {
      // Arrange
      const categoryId = '999';
      const errorMessage = `Category with ID ${categoryId} not found`;
      
      mockRequest.params = { id: categoryId };
      mockDeleteCategoryUseCase.execute.mockRejectedValue(new Error(errorMessage));

      // Act
      await categoryController.deleteCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockDeleteCategoryUseCase.execute).toHaveBeenCalledWith(categoryId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass other errors to next middleware', async () => {
      // Arrange
      const categoryId = '123';
      const error = new Error('Unexpected database error');
      
      mockRequest.params = { id: categoryId };
      mockDeleteCategoryUseCase.execute.mockRejectedValue(error);

      // Act
      await categoryController.deleteCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockDeleteCategoryUseCase.execute).toHaveBeenCalledWith(categoryId);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
}); 