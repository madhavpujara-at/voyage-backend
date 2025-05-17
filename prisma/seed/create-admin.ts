import prisma from '../../src/infrastructure/database/prisma-client';
import { hashPassword } from '../../src/modules/auth/application/utils/authUtils';

async function main() {
  // Define the admin user
  const email = 'admin@example.com';
  const password = 'Admin123!';
  
  console.log(`Creating admin user with email: ${email}`);
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: 'ADMIN'
    }
  });
  
  if (existingAdmin) {
    console.log(`Admin user already exists with email: ${existingAdmin.email}`);
    return;
  }
  
  // Hash the password
  const hashedPassword = await hashPassword(password);
  
  // Create the admin user
  const adminUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  
  console.log(`Admin user created successfully with ID: ${adminUser.id}`);
}

main()
  .catch((e) => {
    console.error('Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 