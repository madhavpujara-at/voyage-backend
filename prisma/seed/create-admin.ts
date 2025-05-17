import prisma from "../../src/infrastructure/database/prisma-client";
import { hashPassword } from "../../src/modules/auth/application/utils/authUtils";

async function main() {
  // Define the admin user details from environment variables
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;

  if (!email || !password || !name) {
    console.error("Error: ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME environment variables must be set.");
    process.exit(1);
  }

  console.log(`Attempting to create or verify admin user with email: ${email}, name: ${name}`);

  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  if (existingAdmin) {
    console.log(`Admin user with role ADMIN already exists. Email: ${existingAdmin.email}. No action taken.`);
    return;
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the admin user
  const adminUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin user created successfully with ID: ${adminUser.id}, Name: ${adminUser.name}`);
}

main()
  .catch((e) => {
    console.error("Error creating admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
