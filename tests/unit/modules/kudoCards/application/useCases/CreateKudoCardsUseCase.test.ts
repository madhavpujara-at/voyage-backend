import { mock } from 'jest-mock-extended';
import { IKudoCardRepository } from '../../../../../../src/modules/kudoCards/domain/interfaces/repositories/IKudoCardsRepository';
import { CreateKudoCardsUseCase } from '../../../../../../src/modules/kudoCards/application/useCases/createKudoCards/CreateKudoCardsUseCase';
import { CreateKudoCardsRequestDto } from '../../../../../../src/modules/kudoCards/application/useCases/createKudoCards/CreateKudoCardsRequestDto';
import { KudoCard } from '../../../../../../src/modules/kudoCards/domain/entities/KudoCards';

// Mock crypto to return a predictable UUID
jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('mocked-uuid-123')
}));

describe('CreateKudoCardsUseCase', () => {
  let createKudoCardsUseCase: CreateKudoCardsUseCase;
  let mockKudoCardRepository: jest.Mocked<IKudoCardRepository>;
  
  const mockGiverId = 'giver-123';
  const mockRequestDto: CreateKudoCardsRequestDto = {
    message: 'Great work on the project!',
    recipientName: 'John Doe',
    teamId: 'team-123',
    categoryId: 'category-123',
  };
  
  beforeEach(() => {
    mockKudoCardRepository = mock<IKudoCardRepository>();
    createKudoCardsUseCase = new CreateKudoCardsUseCase(mockKudoCardRepository);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
  });
  
  it('should create a kudoCard successfully', async () => {
    // Setup the mock to return a KudoCard
    const mockKudoCard = new KudoCard(
      'mocked-uuid-123',
      mockRequestDto.message,
      mockRequestDto.recipientName,
      mockGiverId,
      mockRequestDto.teamId,
      mockRequestDto.categoryId,
      expect.any(Date),
      expect.any(Date)
    );
    
    mockKudoCardRepository.saveEntity.mockResolvedValue(mockKudoCard);
    
    // Execute the use case
    const result = await createKudoCardsUseCase.execute(mockRequestDto, mockGiverId);
    
    // Verify the repository was called correctly
    expect(mockKudoCardRepository.saveEntity).toHaveBeenCalledTimes(1);
    expect(mockKudoCardRepository.saveEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mocked-uuid-123',
        getMessage: expect.any(Function),
        getRecipientName: expect.any(Function),
      })
    );
    
    // Verify the result
    expect(result).toEqual({
      id: 'mocked-uuid-123',
      success: true,
    });
  });
  
  it('should propagate errors from repository', async () => {
    // Setup the mock to throw an error
    const error = new Error('Database error');
    mockKudoCardRepository.saveEntity.mockRejectedValue(error);
    
    // Execute and expect error
    await expect(createKudoCardsUseCase.execute(mockRequestDto, mockGiverId))
      .rejects.toThrow('Database error');
    
    // Verify the repository was called
    expect(mockKudoCardRepository.saveEntity).toHaveBeenCalledTimes(1);
  });
  
  it('should propagate validation errors from KudoCard entity', async () => {
    // Create a request with invalid data (empty message)
    const invalidRequestDto: CreateKudoCardsRequestDto = {
      ...mockRequestDto,
      message: '', // This should trigger a validation error in the KudoCard entity
    };
    
    // Execute and expect error
    await expect(createKudoCardsUseCase.execute(invalidRequestDto, mockGiverId))
      .rejects.toThrow('Message cannot be empty');
    
    // Verify the repository was not called because validation failed
    expect(mockKudoCardRepository.saveEntity).not.toHaveBeenCalled();
  });
}); 