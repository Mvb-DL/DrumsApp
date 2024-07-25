import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const { id, role, firstName, lastName, password } = await req.json();

  try {
    let updatedUser;
    const data: any = { firstName, lastName };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      data.password = hashedPassword; // Hash the password before saving
    }

    switch (role) {
      case 'teacher':
        updatedUser = await prisma.teacher.update({
          where: { id: id },
          data,
        });
        break;
      case 'student':
        updatedUser = await prisma.student.update({
          where: { id: id },
          data,
        });
        break;
      case 'customer':
        updatedUser = await prisma.customer.update({
          where: { id: id },
          data,
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
