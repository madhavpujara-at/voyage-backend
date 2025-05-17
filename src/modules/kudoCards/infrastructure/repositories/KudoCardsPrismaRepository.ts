import { PrismaClient, Prisma } from "../../../../infrastructure/database/generated/prisma";
import { KudoCard } from "../../domain/entities/KudoCards";
import {
  FindAllKudoCardsOptions,
  IKudoCardRepository,
} from "../../domain/interfaces/repositories/IKudoCardsRepository";

export class KudoCardPrismaRepository implements IKudoCardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async saveEntity(kudoCard: KudoCard): Promise<KudoCard> {
    try {
      // For new entities, always try to create first
      if (!kudoCard.id || kudoCard.id === '') {
        return this.createKudoCard(kudoCard);
      }
      
      // Check if the entity exists before updating
      const existingKudo = await this.prisma.kudo.findUnique({
        where: { id: kudoCard.id }
      });
      
      // If the entity doesn't exist, create it instead of updating
      if (!existingKudo) {
        return this.createKudoCard(kudoCard);
      }
      
      // For updating existing entities
      const result = await this.prisma.kudo.update({
        where: { id: kudoCard.id },
        data: {
          message: kudoCard.getMessage(),
          recipientName: kudoCard.getRecipientName(),
        },
        include: {
          giver: {
            select: {
              id: true,
              email: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return new KudoCard(
        result.id,
        result.message,
        result.recipientName,
        result.giverId,
        result.teamId,
        result.categoryId,
        result.createdAt,
        result.updatedAt,
        result.team.name,
        result.category.name,
        result.giver.email,
      );
    } catch (error) {
      console.error("Error in saveEntity:", error);
      throw error;
    }
  }

  // Helper method to create a new kudo card
  private async createKudoCard(kudoCard: KudoCard): Promise<KudoCard> {
    try {
      const result = await this.prisma.kudo.create({
        data: {
          // Use the client-provided ID if it exists
          ...(kudoCard.id && kudoCard.id !== '' ? { id: kudoCard.id } : {}),
          message: kudoCard.getMessage(),
          recipientName: kudoCard.getRecipientName(),
          giver: {
            connect: { id: kudoCard.getGiverId() },
          },
          team: {
            connect: { id: kudoCard.getTeamId() },
          },
          category: {
            connect: { id: kudoCard.getCategoryId() },
          },
        },
        include: {
          giver: {
            select: {
              id: true,
              email: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return new KudoCard(
        result.id,
        result.message,
        result.recipientName,
        result.giverId,
        result.teamId,
        result.categoryId,
        result.createdAt,
        result.updatedAt,
        result.team.name,
        result.category.name,
        result.giver.email,
      );
    } catch (error) {
      console.error("Error creating kudo card:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<KudoCard | null> {
    const result = await this.prisma.kudo.findUnique({
      where: { id },
      include: {
        giver: {
          select: {
            id: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!result) {
      return null;
    }

    return new KudoCard(
      result.id,
      result.message,
      result.recipientName,
      result.giverId,
      result.teamId,
      result.categoryId,
      result.createdAt,
      result.updatedAt,
      result.team.name,
      result.category.name,
      result.giver.email,
    );
  }

  async findAll(options?: FindAllKudoCardsOptions): Promise<KudoCard[]> {
    // Build the where clause based on provided options
    const where: Prisma.KudoWhereInput = {};

    if (options?.recipientName) {
      where.recipientName = {
        contains: options.recipientName,
        mode: "insensitive",
      };
    }

    if (options?.teamId) {
      where.teamId = options.teamId;
    }

    if (options?.categoryId) {
      where.categoryId = options.categoryId;
    }

    if (options?.searchTerm) {
      const searchTerm = options.searchTerm.trim();
      where.OR = [
        {
          message: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          recipientName: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        // Additional search in team name through relation
        {
          team: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        // Additional search in category name through relation
        {
          category: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // Determine sort order
    const orderBy = {
      createdAt: options?.sortBy === "oldest" ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
    };

    // Execute the query
    const results = await this.prisma.kudo.findMany({
      where,
      orderBy,
      include: {
        giver: {
          select: {
            id: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Map to domain entities
    return results.map(
      (result) =>
        new KudoCard(
          result.id,
          result.message,
          result.recipientName,
          result.giverId,
          result.teamId,
          result.categoryId,
          result.createdAt,
          result.updatedAt,
          result.team.name,
          result.category.name,
          result.giver.email,
        ),
    );
  }
}
