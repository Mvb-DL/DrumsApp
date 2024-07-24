import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password, trackId, teacherId } = await request.json();

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        trackId,
        teacherId,
        role: 'student',
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Failed to add student', error);
    return NextResponse.json({ error: 'Failed to add student' }, { status: 500 });
  }
}
