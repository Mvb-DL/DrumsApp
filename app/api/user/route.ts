import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const { id, role, firstName, lastName } = await req.json();

  try {
    let updatedUser;

    switch (role) {
      case 'teacher':
        updatedUser = await prisma.teacher.update({
          where: { id: id },
          data: { firstName, lastName },
        });
        break;
      case 'student':
        updatedUser = await prisma.student.update({
          where: { id: id },
          data: { firstName, lastName },
        });
        break;
      case 'customer':
        updatedUser = await prisma.customer.update({
          where: { id: id },
          data: { firstName, lastName },
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
