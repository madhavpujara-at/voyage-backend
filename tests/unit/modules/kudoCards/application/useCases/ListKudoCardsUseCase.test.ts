import { mock } from 'jest-mock-extended';
import { IKudoCardRepository } from '../../../../../../src/modules/kudoCards/domain/interfaces/repositories/IKudoCardsRepository';
import { ListKudoCardsUseCase } from '../../../../../../src/modules/kudoCards/application/useCases/listKudoCards/ListKudoCardsUseCase';
import { ListKudoCardsRequestDto } from '../../../../../../src/modules/kudoCards/application/useCases/listKudoCards/ListKudoCardsRequestDto';
import { KudoCard } from '../../../../../../src/modules/kudoCards/domain/entities/KudoCards';

describe('ListKudoCardsUseCase', () => {
  let listKudoCardsUseCase: ListKudoCardsUseCase;
  let mockKudoCardRepository: jest.Mocked<IKudoCardRepository>;
  
  beforeEach(() => {
    mockKudoCardRepository = mock<IKudoCardRepository>();
    listKudoCardsUseCase = new ListKudoCardsUseCase(mockKudoCardRepository);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
  });
  
  it('should list kudoCards successfully with default sorting', async () => {
    // Setup test data
    const requestDto: ListKudoCardsRequestDto = {
      recipientName: 'John',
    };
    
    // Create mock KudoCards
    const mockKudoCards = [
      createMockKudoCard('id-1', 'Message 1', 'John Doe'),
      createMockKudoCard('id-2', 'Message 2', 'John Smith'),
    ];
    
    // Setup mock repository response
    mockKudoCardRepository.findAll.mockResolvedValue(mockKudoCards);
    
    // Execute the use case
    const result = await listKudoCardsUseCase.execute(requestDto);
    
    // Verify repository was called with correct options
    expect(mockKudoCardRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockKudoCardRepository.findAll).toHaveBeenCalledWith({
      recipientName: 'John',
      sortBy: 'recent', // Default sort
    });
    
    // Verify the response
    expect(result).toEqual({
      kudoCards: [
        {
          id: 'id-1',
          message: 'Message 1',
          recipientName: 'John Doe',
          giverId: 'giver-123',
          giverEmail: undefined,
          teamId: 'team-123',
          teamName: undefined,
          categoryId: 'category-123',
          categoryName: undefined,
          createdAt: expect.any(Date),
        },
        {
          id: 'id-2',
          message: 'Message 2',
          recipientName: 'John Smith',
          giverId: 'giver-123',
          giverEmail: undefined,
          teamId: 'team-123',
          teamName: undefined,
          categoryId: 'category-123',
          categoryName: undefined,
          createdAt: expect.any(Date),
        },
      ],
      total: 2,
    });
  });
  
  it('should use provided sort option', async () => {
    // Setup test data with explicit sort
    const requestDto: ListKudoCardsRequestDto = {
      sortBy: 'oldest',
    };
    
    // Setup empty response for simplicity
    mockKudoCardRepository.findAll.mockResolvedValue([]);
    
    // Execute the use case
    await listKudoCardsUseCase.execute(requestDto);
    
    // Verify repository was called with correct sort option
    expect(mockKudoCardRepository.findAll).toHaveBeenCalledWith({
      sortBy: 'oldest',
    });
  });
  
  it('should apply all filter options correctly', async () => {
    // Setup test data with all filters
    const requestDto: ListKudoCardsRequestDto = {
      recipientName: 'John',
      teamId: 'team-123',
      categoryId: 'category-456',
      searchTerm: 'great work',
      sortBy: 'recent',
    };
    
    // Setup empty response for simplicity
    mockKudoCardRepository.findAll.mockResolvedValue([]);
    
    // Execute the use case
    await listKudoCardsUseCase.execute(requestDto);
    
    // Verify repository was called with all filter options
    expect(mockKudoCardRepository.findAll).toHaveBeenCalledWith({
      recipientName: 'John',
      teamId: 'team-123',
      categoryId: 'category-456',
      searchTerm: 'great work',
      sortBy: 'recent',
    });
  });
  
  it('should include optional properties in the response when available', async () => {
    // Setup test data
    const requestDto: ListKudoCardsRequestDto = {};
    
    // Create a mock KudoCard with optional properties
    const mockKudoCard = createMockKudoCard(
      'id-1', 
      'Great job!', 
      'John Doe', 
      'Team Name', 
      'Category Name', 
      'giver@example.com'
    );
    
    // Setup mock repository response
    mockKudoCardRepository.findAll.mockResolvedValue([mockKudoCard]);
    
    // Execute the use case
    const result = await listKudoCardsUseCase.execute(requestDto);
    
    // Verify the response includes optional properties
    expect(result.kudoCards[0]).toEqual({
      id: 'id-1',
      message: 'Great job!',
      recipientName: 'John Doe',
      giverId: 'giver-123',
      giverEmail: 'giver@example.com',
      teamId: 'team-123',
      teamName: 'Team Name',
      categoryId: 'category-123',
      categoryName: 'Category Name',
      createdAt: expect.any(Date),
    });
  });
  
  it('should handle empty results', async () => {
    // Setup test data
    const requestDto: ListKudoCardsRequestDto = {};
    
    // Setup empty response
    mockKudoCardRepository.findAll.mockResolvedValue([]);
    
    // Execute the use case
    const result = await listKudoCardsUseCase.execute(requestDto);
    
    // Verify the empty response
    expect(result).toEqual({
      kudoCards: [],
      total: 0,
    });
  });
  
  it('should propagate errors from repository', async () => {
    // Setup test data
    const requestDto: ListKudoCardsRequestDto = {};
    
    // Setup error from repository
    const error = new Error('Repository error');
    mockKudoCardRepository.findAll.mockRejectedValue(error);
    
    // Execute and expect error
    await expect(listKudoCardsUseCase.execute(requestDto))
      .rejects.toThrow('Repository error');
  });
});

// Helper function to create mock KudoCard instances
function createMockKudoCard(
  id: string, 
  message: string, 
  recipientName: string,
  teamName?: string,
  categoryName?: string,
  giverEmail?: string
): KudoCard {
  const mockCreatedAt = new Date();
  const mockUpdatedAt = new Date();
  
  const kudoCard = new KudoCard(
    id,
    message,
    recipientName,
    'giver-123', // giverId
    'team-123',  // teamId
    'category-123', // categoryId
    mockCreatedAt,
    mockUpdatedAt,
    teamName,
    categoryName,
    giverEmail
  );
  
  return kudoCard;
} 