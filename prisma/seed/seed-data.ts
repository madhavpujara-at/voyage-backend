import prisma from "../../src/infrastructure/database/prisma-client";
import { hashPassword } from "../../src/modules/auth/application/utils/authUtils";
import { randomUUID } from "crypto";

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data (if needed)
  console.log("Cleaning up existing data...");
  await prisma.kudo.deleteMany();
  await prisma.category.deleteMany();
  await prisma.team.deleteMany();
  // Don't delete users if you want to keep the admin

  // Seed Users
  console.log("Seeding users...");
  const users: any[] = [];
  
  // Create 10 team members
  for (let i = 1; i <= 10; i++) {
    const userId = randomUUID();
    const hashedPassword = await hashPassword("password123");
    const user = await prisma.user.create({
      data: {
        id: userId,
        email: `team-member${i}@example.com`,
        name: `Team Member ${i}`,
        password: hashedPassword,
        role: "TEAM_MEMBER",
      },
    });
    users.push(user);
  }

  // Create 5 tech leads
  for (let i = 1; i <= 5; i++) {
    const userId = randomUUID();
    const hashedPassword = await hashPassword("password123");
    const user = await prisma.user.create({
      data: {
        id: userId,
        email: `tech-lead${i}@example.com`,
        name: `Tech Lead ${i}`,
        password: hashedPassword,
        role: "TECH_LEAD",
      },
    });
    users.push(user);
  }

  console.log(`Created ${users.length} users`);

  // Seed 7 Teams
  console.log("Seeding teams...");
  const teamNames = [
    "Engineering", 
    "Design", 
    "Product", 
    "Marketing", 
    "Customer Support", 
    "Sales", 
    "Operations"
  ];
  const teams: any[] = [];

  for (const name of teamNames) {
    const teamId = randomUUID();
    const team = await prisma.team.create({
      data: {
        id: teamId,
        name,
      },
    });
    teams.push(team);
  }

  console.log(`Created ${teams.length} teams`);

  // Seed 7 Categories
  console.log("Seeding categories...");
  const categoryNames = [
    "Team Player", 
    "Innovation", 
    "Leadership", 
    "Problem Solving", 
    "Customer Focus",
    "Quality Excellence",
    "Going Above and Beyond"
  ];
  const categories: any[] = [];

  for (const name of categoryNames) {
    const categoryId = randomUUID();
    const category = await prisma.category.create({
      data: {
        id: categoryId,
        name,
      },
    });
    categories.push(category);
  }

  console.log(`Created ${categories.length} categories`);

  // Seed Kudos
  console.log("Seeding kudos...");
  const kudoMessages = [
    "Thank you for your amazing help with the project!",
    "Your contribution to the team has been outstanding.",
    "I appreciate your dedication and hard work.",
    "You went above and beyond in helping us meet our deadline.",
    "Your innovative solution solved our complex problem.",
    "Thank you for stepping up when we needed you most.",
    "Your positive attitude makes our team better.",
    "Thanks for sharing your knowledge and helping me grow.",
    "Your attention to detail made a big difference.",
    "You're a true team player and it shows in everything you do.",
    "I couldn't have done it without your support!",
    "Your expertise was crucial to our success.",
    "Thanks for always being reliable and consistent.",
    "Your mentorship has been invaluable to me.",
    "The way you handled that situation was impressive.",
    "Your creativity inspired the whole team.",
    "Thank you for the thoughtful code review.",
    "You made a complex problem look easy.",
    "Your commitment to quality is exemplary.",
    "The way you collaborate with others is inspiring."
  ];
  
  const recipientNames = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
    "Jessica Taylor",
    "Chris Martinez",
    "Amanda Thomas",
    "Robert Anderson",
    "Melissa Jackson",
    "William Lee",
    "Jennifer Garcia",
    "James Rodriguez",
    "Elizabeth Phillips",
    "Daniel Wright",
    "Lisa Campbell",
    "Richard Young",
    "Michelle Allen",
    "Joseph King",
    "Patricia Walker"
  ];

  const kudos: any[] = [];

  // Create 100 random kudos
  for (let i = 0; i < 100; i++) {
    const kudoId = randomUUID();
    const randomGiver = users[Math.floor(Math.random() * users.length)];
    const randomTeam = teams[Math.floor(Math.random() * teams.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomMessage = kudoMessages[Math.floor(Math.random() * kudoMessages.length)];
    const randomRecipient = recipientNames[Math.floor(Math.random() * recipientNames.length)];
    
    const kudo = await prisma.kudo.create({
      data: {
        id: kudoId,
        message: randomMessage,
        recipientName: randomRecipient,
        giverId: randomGiver.id,
        teamId: randomTeam.id,
        categoryId: randomCategory.id,
      },
    });
    
    kudos.push(kudo);
  }

  console.log(`Created ${kudos.length} kudos`);
  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 