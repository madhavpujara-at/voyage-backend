export class KudoCard {
  constructor(
    public readonly id: string,
    private message: string,
    private recipientName: string,
    public readonly giverId: string,
    public readonly teamId: string,
    public readonly categoryId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    private readonly teamName?: string,
    private readonly categoryName?: string,
    private readonly giverEmail?: string,
    private readonly giverName?: string,
  ) {
    this.validateMessage(message);
    this.validateRecipientName(recipientName);
  }

  // Validation methods
  private validateMessage(message: string): void {
    if (!message || message.trim().length === 0) {
      throw new Error("Message cannot be empty");
    }
    if (message.length > 500) {
      throw new Error("Message cannot exceed 500 characters");
    }
  }

  private validateRecipientName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Recipient name cannot be empty");
    }
    if (name.length > 100) {
      throw new Error("Recipient name cannot exceed 100 characters");
    }
  }

  // Update methods
  public updateMessage(newMessage: string): void {
    this.validateMessage(newMessage);
    this.message = newMessage;
  }

  public updateRecipientName(newRecipientName: string): void {
    this.validateRecipientName(newRecipientName);
    this.recipientName = newRecipientName;
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getMessage(): string {
    return this.message;
  }

  public getRecipientName(): string {
    return this.recipientName;
  }

  public getGiverId(): string {
    return this.giverId;
  }

  public getTeamId(): string {
    return this.teamId;
  }

  public getCategoryId(): string {
    return this.categoryId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
  
  public getTeamName(): string | undefined {
    return this.teamName;
  }
  
  public getCategoryName(): string | undefined {
    return this.categoryName;
  }
  
  public getGiverEmail(): string | undefined {
    return this.giverEmail;
  }
  public getGiverName(): string | undefined {
    return this.giverName;
  }

  // Data conversion
  public toObject() {
    return {
      id: this.id,
      message: this.message,
      recipientName: this.recipientName,
      giverId: this.giverId,
      teamId: this.teamId,
      categoryId: this.categoryId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      teamName: this.teamName,
      categoryName: this.categoryName,
      giverEmail: this.giverEmail,
      giverName: this.giverName,
    };
  }
}
