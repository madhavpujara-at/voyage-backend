import { Team } from "../../../../../../src/modules/teams/domain/entities/Team";

describe("Team Entity", () => {
  it("should create a valid team", () => {
    // Arrange
    const id = "123";
    const name = "Engineering Team";
    const createdAt = new Date();
    const updatedAt = new Date();

    // Act
    const team = new Team(id, name, createdAt, updatedAt);

    // Assert
    expect(team.id).toBe(id);
    expect(team.getName()).toBe(name);
    expect(team.createdAt).toBe(createdAt);
    expect(team.updatedAt).toBe(updatedAt);
  });

  it("should throw error when name is empty", () => {
    // Arrange
    const id = "123";
    const name = "";
    const createdAt = new Date();
    const updatedAt = new Date();

    // Act & Assert
    expect(() => {
      new Team(id, name, createdAt, updatedAt);
    }).toThrow("Team name cannot be empty");
  });

  it("should throw error when name exceeds 100 characters", () => {
    // Arrange
    const id = "123";
    const name = "a".repeat(101); // Create a string longer than 100 characters
    const createdAt = new Date();
    const updatedAt = new Date();

    // Act & Assert
    expect(() => {
      new Team(id, name, createdAt, updatedAt);
    }).toThrow("Team name cannot exceed 100 characters");
  });

  it("should allow updating team name", () => {
    // Arrange
    const id = "123";
    const initialName = "Engineering Team";
    const newName = "Product Team";
    const createdAt = new Date();
    const updatedAt = new Date();
    const team = new Team(id, initialName, createdAt, updatedAt);

    // Act
    team.updateName(newName);

    // Assert
    expect(team.getName()).toBe(newName);
  });

  it("should throw error when updating to invalid name", () => {
    // Arrange
    const id = "123";
    const initialName = "Engineering Team";
    const invalidName = "";
    const createdAt = new Date();
    const updatedAt = new Date();
    const team = new Team(id, initialName, createdAt, updatedAt);

    // Act & Assert
    expect(() => {
      team.updateName(invalidName);
    }).toThrow("Team name cannot be empty");
  });

  it("should convert to object", () => {
    // Arrange
    const id = "123";
    const name = "Engineering Team";
    const createdAt = new Date();
    const updatedAt = new Date();
    const team = new Team(id, name, createdAt, updatedAt);

    // Act
    const teamObject = team.toObject();

    // Assert
    expect(teamObject).toEqual({
      id,
      name,
      createdAt,
      updatedAt,
    });
  });
}); 