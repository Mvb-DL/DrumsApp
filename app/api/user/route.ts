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
      data.password = hashedPassword; 
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

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const role = req.nextUrl.searchParams.get('role');

  if (!id || !role) {
    return NextResponse.json({ error: 'ID and role are required' }, { status: 400 });
  }

  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    switch (role) {
      case 'teacher':
        await prisma.teacher.delete({
          where: { id: numericId },
        });
        break;
      case 'student':
        await prisma.student.delete({
          where: { id: numericId },
        });
        break;
      case 'customer':
        await prisma.customer.delete({
          where: { id: numericId },
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
