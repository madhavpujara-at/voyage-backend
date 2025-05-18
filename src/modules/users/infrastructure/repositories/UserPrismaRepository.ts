import { PrismaClient, UserRole as PrismaUserRoleEnum } from "../../../../infrastructure/database/generated/prisma";
import { User } from "../../domain/entities/User";
import { UserRole } from "../../../auth/domain/entities/User";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";

export class UserPrismaRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!userData) return null;
    return new User(
      userData.id,
      userData.email,
      userData.name,
      userData.password,
      userData.role as UserRole,
      userData.createdAt,
      userData.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!userData) return null;
    return new User(
      userData.id,
      userData.email,
      userData.name,
      userData.password,
      userData.role as UserRole,
      userData.createdAt,
      userData.updatedAt,
    );
  }

  async findAll(): Promise<User[]> {
    const usersData = await this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true, password: true },
    });
    return usersData.map(
      (ud) => new User(ud.id, ud.email, ud.name, ud.password, ud.role as UserRole, ud.createdAt, ud.updatedAt),
    );
  }

  async findUsersByRole(role: UserRole): Promise<User[]> {
    const usersData = await this.prisma.user.findMany({
      where: { role: role as PrismaUserRoleEnum },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });
    return usersData.map(
      (ud) => new User(ud.id, ud.email, ud.name, ud.password, ud.role as UserRole, ud.createdAt, ud.updatedAt),
    );
  }

  async save(user: User): Promise<void> {
    const userDataFromEntity = {
      id: user.id,
      email: user.getEmail(),
      name: user.getName(),
      role: user.getRole() as PrismaUserRoleEnum,
      password: user.getPassword(),
      createdAt: user.createdAt,
      updatedAt: new Date(),
    };
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: userDataFromEntity,
      update: {
        email: userDataFromEntity.email,
        name: userDataFromEntity.name,
        role: userDataFromEntity.role,
      },
    });
  }

  async updateRole(userId: string, newRole: UserRole): Promise<User> {
    const updatedUserData = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole as PrismaUserRoleEnum },
    });
    if (!updatedUserData) throw new Error("User not found for role update");
    return new User(
      updatedUserData.id,
      updatedUserData.email,
      updatedUserData.name,
      updatedUserData.password,
      updatedUserData.role as UserRole,
      updatedUserData.createdAt,
      updatedUserData.updatedAt,
    );
  }

  async create(userDataFromEntityFields: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const userToCreate = userDataFromEntityFields as User;
    const newUser = await this.prisma.user.create({
      data: {
        email: userToCreate.getEmail(),
        name: userToCreate.getName(),
        password: userToCreate.getPassword(),
        role: userToCreate.getRole() as PrismaUserRoleEnum,
      },
    });
    return new User(
      newUser.id,
      newUser.email,
      newUser.name,
      newUser.password,
      newUser.role as UserRole,
      newUser.createdAt,
      newUser.updatedAt,
    );
  }

  async countUsers(): Promise<number> {
    return this.prisma.user.count();
  }
}
