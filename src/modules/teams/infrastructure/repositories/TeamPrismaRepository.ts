import { PrismaClient } from "@/infrastructure/database/generated/prisma";
import { ITeamRepository } from "../../domain/interfaces/repositories/ITeamRepository";
import { Team } from "../../domain/entities/Team";

export class TeamPrismaRepository implements ITeamRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: string): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      return null;
    }

    return new Team(team.id, team.name, team.createdAt, team.updatedAt);
  }

  async findByName(name: string): Promise<Team | null> {
    const team = await this.prisma.team.findFirst({
      where: { name },
    });

    if (!team) {
      return null;
    }

    return new Team(team.id, team.name, team.createdAt, team.updatedAt);
  }

  async findAll(): Promise<Team[]> {
    const teams = await this.prisma.team.findMany({
      orderBy: { name: "asc" },
    });

    return teams.map((team) => new Team(team.id, team.name, team.createdAt, team.updatedAt));
  }

  async save(team: Team): Promise<void> {
    await this.prisma.team.upsert({
      where: { id: team.id },
      update: {
        name: team.getName(),
        updatedAt: new Date(),
      },
      create: {
        id: team.id,
        name: team.getName(),
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.team.delete({
      where: { id },
    });
  }
}
