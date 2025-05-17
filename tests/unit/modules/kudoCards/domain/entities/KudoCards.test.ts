import { KudoCard } from '../../../../../../src/modules/kudoCards/domain/entities/KudoCards';

describe('KudoCard Entity', () => {
  const validCardProps = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    message: 'Thank you for your help!',
    recipientName: 'John Doe',
    giverId: 'giver-123',
    teamId: 'team-123',
    categoryId: 'category-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create a valid KudoCard entity', () => {
    const kudoCard = new KudoCard(
      validCardProps.id,
      validCardProps.message,
      validCardProps.recipientName,
      validCardProps.giverId,
      validCardProps.teamId,
      validCardProps.categoryId,
      validCardProps.createdAt,
      validCardProps.updatedAt
    );

    expect(kudoCard.getId()).toBe(validCardProps.id);
    expect(kudoCard.getMessage()).toBe(validCardProps.message);
    expect(kudoCard.getRecipientName()).toBe(validCardProps.recipientName);
    expect(kudoCard.getGiverId()).toBe(validCardProps.giverId);
    expect(kudoCard.getTeamId()).toBe(validCardProps.teamId);
    expect(kudoCard.getCategoryId()).toBe(validCardProps.categoryId);
    expect(kudoCard.getCreatedAt()).toBe(validCardProps.createdAt);
    expect(kudoCard.getUpdatedAt()).toBe(validCardProps.updatedAt);
  });

  it('should create a KudoCard with optional properties', () => {
    const teamName = 'Engineering';
    const categoryName = 'Teamwork';
    const giverEmail = 'giver@example.com';

    const kudoCard = new KudoCard(
      validCardProps.id,
      validCardProps.message,
      validCardProps.recipientName,
      validCardProps.giverId,
      validCardProps.teamId,
      validCardProps.categoryId,
      validCardProps.createdAt,
      validCardProps.updatedAt,
      teamName,
      categoryName,
      giverEmail
    );

    expect(kudoCard.getTeamName()).toBe(teamName);
    expect(kudoCard.getCategoryName()).toBe(categoryName);
    expect(kudoCard.getGiverEmail()).toBe(giverEmail);
  });

  it('should throw error when message is empty', () => {
    expect(() => {
      new KudoCard(
        validCardProps.id,
        '',
        validCardProps.recipientName,
        validCardProps.giverId,
        validCardProps.teamId,
        validCardProps.categoryId,
        validCardProps.createdAt,
        validCardProps.updatedAt
      );
    }).toThrow('Message cannot be empty');
  });

  it('should throw error when message exceeds 500 characters', () => {
    const longMessage = 'a'.repeat(501);
    
    expect(() => {
      new KudoCard(
        validCardProps.id,
        longMessage,
        validCardProps.recipientName,
        validCardProps.giverId,
        validCardProps.teamId,
        validCardProps.categoryId,
        validCardProps.createdAt,
        validCardProps.updatedAt
      );
    }).toThrow('Message cannot exceed 500 characters');
  });

  it('should throw error when recipient name is empty', () => {
    expect(() => {
      new KudoCard(
        validCardProps.id,
        validCardProps.message,
        '',
        validCardProps.giverId,
        validCardProps.teamId,
        validCardProps.categoryId,
        validCardProps.createdAt,
        validCardProps.updatedAt
      );
    }).toThrow('Recipient name cannot be empty');
  });

  it('should throw error when recipient name exceeds 100 characters', () => {
    const longName = 'a'.repeat(101);
    
    expect(() => {
      new KudoCard(
        validCardProps.id,
        validCardProps.message,
        longName,
        validCardProps.giverId,
        validCardProps.teamId,
        validCardProps.categoryId,
        validCardProps.createdAt,
        validCardProps.updatedAt
      );
    }).toThrow('Recipient name cannot exceed 100 characters');
  });

  it('should update message successfully', () => {
    const kudoCard = new KudoCard(
      validCardProps.id,
      validCardProps.message,
      validCardProps.recipientName,
      validCardProps.giverId,
      validCardProps.teamId,
      validCardProps.categoryId,
      validCardProps.createdAt,
      validCardProps.updatedAt
    );

    const newMessage = 'Updated message';
    kudoCard.updateMessage(newMessage);
    expect(kudoCard.getMessage()).toBe(newMessage);
  });

  it('should update recipient name successfully', () => {
    const kudoCard = new KudoCard(
      validCardProps.id,
      validCardProps.message,
      validCardProps.recipientName,
      validCardProps.giverId,
      validCardProps.teamId,
      validCardProps.categoryId,
      validCardProps.createdAt,
      validCardProps.updatedAt
    );

    const newRecipientName = 'Jane Smith';
    kudoCard.updateRecipientName(newRecipientName);
    expect(kudoCard.getRecipientName()).toBe(newRecipientName);
  });

  it('should convert to object correctly', () => {
    const teamName = 'Engineering';
    const categoryName = 'Teamwork';
    const giverEmail = 'giver@example.com';

    const kudoCard = new KudoCard(
      validCardProps.id,
      validCardProps.message,
      validCardProps.recipientName,
      validCardProps.giverId,
      validCardProps.teamId,
      validCardProps.categoryId,
      validCardProps.createdAt,
      validCardProps.updatedAt,
      teamName,
      categoryName,
      giverEmail
    );

    const obj = kudoCard.toObject();
    expect(obj).toEqual({
      id: validCardProps.id,
      message: validCardProps.message,
      recipientName: validCardProps.recipientName,
      giverId: validCardProps.giverId,
      teamId: validCardProps.teamId,
      categoryId: validCardProps.categoryId,
      createdAt: validCardProps.createdAt,
      updatedAt: validCardProps.updatedAt,
      teamName,
      categoryName,
      giverEmail,
    });
  });
}); 