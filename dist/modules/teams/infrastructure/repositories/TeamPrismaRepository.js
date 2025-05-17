"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamPrismaRepository = void 0;
const Team_1 = require("../../domain/entities/Team");
class TeamPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const team = await this.prisma.team.findUnique({
            where: { id },
        });
        if (!team) {
            return null;
        }
        return new Team_1.Team(team.id, team.name, team.createdAt, team.updatedAt);
    }
    async findByName(name) {
        const team = await this.prisma.team.findFirst({
            where: { name },
        });
        if (!team) {
            return null;
        }
        return new Team_1.Team(team.id, team.name, team.createdAt, team.updatedAt);
    }
    async findAll() {
        const teams = await this.prisma.team.findMany({
            orderBy: { name: "asc" },
        });
        return teams.map((team) => new Team_1.Team(team.id, team.name, team.createdAt, team.updatedAt));
    }
    async save(team) {
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
    async delete(id) {
        await this.prisma.team.delete({
            where: { id },
        });
    }
}
exports.TeamPrismaRepository = TeamPrismaRepository;
//# sourceMappingURL=TeamPrismaRepository.js.map