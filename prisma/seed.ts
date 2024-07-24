const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'mario@web.de';
  const existingAdmin = await prisma.admin.findUnique({ where: { email } });

  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync('12993409', 8); // Replace 'securepassword' with the desired password

    await prisma.admin.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        username: 'mario',
        email,
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('Admin user created.');
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
